const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./DATABASE/db");

const payment = require("./ROUTES/payemts.route");
const studentEntroll = require("./ROUTES/studentsRecords.route");
const existingstudents = require("./ROUTES/existingStudentsRecords.route");
const adminRegister = require("./ROUTES/adminRegister.route");
const adminLogin = require("./ROUTES/adminLogin.route");
const studentRegister=require("./ROUTES/studentRegister.route")
const studentLogin=require("./ROUTES/studentsLogin")
const events=require("./ROUTES/events.route")
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use("/payments", payment);
app.use("/student", studentEntroll);
app.use("/existingstudents", existingstudents);
app.use("/adminRegister", adminRegister);
app.use("/adminLogin", adminLogin);
app.use("/studentRegister", studentRegister);
app.use("/studentLogin", studentLogin);
app.use("/events",events)

//app listen..................
app.get("/", (req, res) => {
  try {
    res.status(200).send("Snjeeevani Backend Project Good to Go");
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING IN PORT NUMBER ${PORT}`);
});
