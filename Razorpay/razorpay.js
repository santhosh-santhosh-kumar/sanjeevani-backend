const razorpay = require("razorpay");
const dotenv = require("dotenv").config;

const razor = new razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.secret_id,
});

module.exports = { razor };
