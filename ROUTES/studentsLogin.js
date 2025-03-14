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

// sent opt verification email

const sendOTPVerificationEmail = async ({_id,email},res)=>{
  try{
    const opt = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to:email,
      subject:"Verify Your Email",
      html:`<p>Enter <b>${opt}</b> in the app to verify your email address and complete the login in</p><br/>
            <p>This code <b>expires in 1 hour</b>.</p>
      `
    }

    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp,saltRounds);
    const newOTPVerification = await new UserOTPVerification({
      userId:_id,
      otp:hashedOTP,
      createdAt:Date.now(),
      expiresAt:Date.now() + 3600000,

    })
    
    // save otp record
    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);
    res.json({
      status:"PENDING",
      message:"Verification otp email send",
      data:{
        userId:_id,
        email,
      }
    })
  }catch(error){
    res.json({
      status:"FAILED",
      message:error.message,
    });
  }
}

module.exports = route;
