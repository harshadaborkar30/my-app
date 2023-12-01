import React, { useEffect } from "react";

import { Formik } from "formik";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import data1 from "./state_district.json";
// npm i yup

import { object, string, number, date, Infertype } from "yup";
import { MenuItem } from "@mui/material";
import { useState } from "react";
import logo from "./download.jpg";
let userSchema = object({
  name: object({
    first: string()
      .required(" Name is required")
      .matches(/^[a-zA-Z]+$/, "Only alphabets are allowed in First Name"),
  }),
  mobile: string()
    .required("Mobile is required")
    .matches(/^[0-9]{10}$/, "Mobile must be 10 digits"),
  email: string().email(),
});
const generateRandomNumber = () => Math.floor(Math.random() * 10) + 1;

const AssignMent = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [data, setdata] = useState(data1);

  const [num1, setNum1] = useState(generateRandomNumber());
  const [num2, setNum2] = useState(generateRandomNumber());
  const [captchaAnswer, setCaptchaAnswer] = useState(num1 + num2);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedDistrict("");
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
  };

  const selectedStateObj = data.states.find(
    (stateObj) => stateObj.state === selectedState
  );
  useEffect(() => {
    setNum1(generateRandomNumber());
    setNum2(generateRandomNumber());
    setCaptchaAnswer(num1 + num2);
  }, [selectedState, selectedDistrict]);

  const validateCaptcha = (userAnswer) => {
    const expectedAnswer = num1 + num2;
    if (parseInt(userAnswer, 10) !== expectedAnswer) {
      return "Incorrect captcha. Please try again.";
    }
    return undefined; // No error
  };
  return (
    <Container sx={{ marginTop: "30px" }}>
      <Card sx={{ textAlign: "center", maxWidth: 500, m: "auto", p: 4 }}>
        <img style={{ height: "80px", width: "auto" }} src={logo} alt="logo" />
        <h3
          style={{
            fontWeight: "bold",
            color: "#151161",
            fontSize: "24px",
          }}
        >
          Apply
        </h3>
        <Formik
          initialValues={{
            name: {
              first: "",
            },
            mobile: "",
            email: "",
          }}
          validate={(user) => {
            let errors = {};

            // Captcha validation
            const captchaSum = num1 + num2;
            if (!user.captcha || parseInt(user.captcha, 10) !== captchaSum) {
              errors.captcha = "Captcha is incorrect";
            }

            if (!user.name || !user.name.first) {
              errors.name = { first: "First Name is required" };
            } else if (!/^[a-zA-Z]+$/.test(user.name.first)) {
              errors.name = {
                first: "Only alphabets are allowed in First Name",
              };
            }
            if (!user.email) {
              errors.email = "Email is required";
            } else if (user?.email?.length < 3) {
              errors.email = "Email must be  atleast 3 chars long!";
            }
            if (!user.mobile) {
              errors.mobile = "Mobile is required";
            } else if (!/^[0-9]{10}$/.test(user.mobile)) {
              errors.mobile = "Mobile must be 10 digits";
            }
            return errors;
          }}
          onSubmit={(values, { handleSubmit }) => {
            const { name, email, mobile } = values;
            const userData = {
              name: `${name.first} ${name.last}`,
              email,
              mobile,
              state: selectedState,
              district: selectedDistrict,
            };

            console.log("User Data", userData);
          }}
        >
          {({
            values: user,
            errors,
            touched,
            handleSubmit,
            handleChange,
            handleBlur,
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Name"
                    name="name.first"
                    value={user.name.first}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched?.name?.first && Boolean(errors?.name?.first)}
                    helperText={touched?.name?.first && errors?.name?.first}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    name="email"
                    value={user?.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors?.email && touched?.email}
                    helperText={touched?.email && errors?.email}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Mobile"
                    name="mobile"
                    value={user?.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors?.mobile && touched?.mobile}
                    helperText={touched?.mobile && errors?.mobile}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Select State"
                    value={selectedState}
                    onChange={handleStateChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="">
                      <em>Select State</em>
                    </MenuItem>
                    {data.states.map((stateObj) => (
                      <MenuItem key={stateObj.state} value={stateObj.state}>
                        {stateObj.state}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Select District"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="">
                      <em>Select District</em>
                    </MenuItem>
                    {selectedStateObj &&
                      selectedStateObj.districts.map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "space-around" }}
                >
                  <p style={{ marginBottom: 8, fontSize: 16 }}>
                    Please solve the captcha: <strong>{num1}</strong> +{" "}
                    <strong>{num2}</strong> <strong> {"="}</strong>
                  </p>

                  <TextField
                    variant="outlined"
                    name="captcha"
                    value={user.captcha}
                    onChange={handleChange}
                    placeholder="Enter addition"
                    onBlur={handleBlur}
                    error={touched?.captcha && errors?.captcha}
                    helperText={touched?.captcha && errors?.captcha}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    sx={{ width: "150px" }}
                    variant="contained"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};
export default AssignMent;
