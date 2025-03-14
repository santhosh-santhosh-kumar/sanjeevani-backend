const express = require("express");
const studentsRecords = require("../MODEL/studentsRecords.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const route = express.Router();




const authorize = (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      if (verified) {
        req.userId = verified.userId;
        next();
      } else {
        res.status(400).send("unauthorized _ 01");
      }
    } catch (err) {
      res.status(400).send("unauthorized _ 02");
    }
  } else {
    res.status(400).send("unauthorized _ 03");
  }
};

route.post("/", async (req, res) => {
  console.log("req.ggdgdebody",req.body);
  try {
    const findUser = await studentsRecords.findOne({ userName: req.body.userName });
  
    if (!findUser) {
      console.log("not")
      return res.status(400).send("User not Found");
    }
    const userId = { id: findUser._id };
    const validatePassword = await bcrypt.compare(
      req.body.password, //password
      findUser.password //abcpassabcword // reference token //jwt token
    );
    if (!validatePassword) {
      
      return res.status(400).send("Invalid credentials");
    }
    if (validatePassword) {
      console.log("success")
      const accessToken = jwt.sign({ userId }, process.env.STUDENT_SECRET_KEY, {
        expiresIn: "1h",
      });
      res.status(200).send(accessToken);
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

route.get("/", authorize, (req, res) => {
  try {
    res.send("success");
  } catch (err) {
    res.send({ err: err.message });
  }
});
module.exports = route;
