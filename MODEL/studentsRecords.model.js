const express = require("express");
const { Schema, model } = require("mongoose");

const schema = new Schema({
  studentID: { type: String, require: true },
  fullName: { type: String, require: true },
  status: { type: Boolean, require: true },
  dob: { type: String, require: true },
  age: { type: Number, require: true },
  gender: { type: String, require: true },
  email: { type: String, require: true },
  currentStandard: { type: String, require: true },
  fatherName: { type: String, require: true },
  motherName: { type: String, require: true },
  fatherPhone: { type: Number, require: true },
  phone: { type: String, require: true },
  residentialAddress: { type: String, require: true },
  join_date: { type: String },
  batchID: { type: String, require: true },
  student_info: { type: String, require: true },
  attentance: [
    {
      attentanceStatus: { type: Boolean, require: true },
      attentanceDate: { type: String },
    },
  ],
  imageUrls: { type: String },
  filename: { type: String },
  monthName: String,
  paymentOderID: String,
  paymentID: String,
  payment_status: { type: Boolean, require: true },
  paid_date: { type: String },
  received_payment: { type: Number },
  paymentPerMonthTotal: { type: Number, require: true },
  paymentTotal: { type: Number, require: true },
  paymentDue: { type: Number, require: true },
  dueMonthCount: { type: Number, require: true },
  userName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  confirm_password: {
    type: String,
    require: true,
  },
});

const studentsRecords = model("studentsRecords", schema);

module.exports = studentsRecords;
