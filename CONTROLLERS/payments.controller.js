const express = require("express");
const { razor } = require("../Razorpay/razorpay");
const { paymentModel } = require("../MODEL/payments.model");


const getPayments = async (req, res) => {
  
  try {
    
    const userRegister = await paymentModel.findOne({ _id: req.query._id });
    const order = await razor.orders.create({
      amount: parseInt(userRegister.price)*100,
      currency: "INR",
      receipt: "repeipt#1",//dynamic
      payment_capture: 1,
    });
    res.status(200).send(order);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

const allPayments=async(req,res)=>{
  try {
    const userRegister = await paymentModel.find();
    res.status(200).send(userRegister);
  } catch (error) {
    res.status(404).send({ error: error.message });
    
  }
}

module.exports = {
  getPayments,
  allPayments
};
