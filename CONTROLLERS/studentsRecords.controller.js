const studentsRecords = require("../MODEL/studentsRecords.model");
const Counter = require("../MODEL/counter.model");
const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");
const cron = require("node-cron");
const path = require("path");
const bcrypt = require("bcrypt");

//get methode - all.................................
const getAllStudentsRecords = async (req, res) => {
  try {
    console.log("work");
    const getAllStudentsRecords = await studentsRecords.find();
    res.status(200).send(getAllStudentsRecords);
  } catch (err) {
    res.status(404).send({ err: err.message });
  }
};

//corn scuhedule for update students payment status = false...................

cron.schedule("* * * 1 *", async () => {
  try {
    await studentsRecords.updateMany(
      { payment_status: true },
      { $set: { payment_status: false } }
    );
  } catch (error) {
    console.error(error);
  }
});

//get methode - single..............................................

const getSingleStudentsRecords = async (req, res) => {
  try {
    const getStudentRecord = await studentsRecords.findById(req.params.id);
    res.status(200).json(getStudentRecord);
  } catch (err) {
    res.status(401).json({ err: err.message });
  }
};

//post methode for adding new students..........................................

const postStudentsRecords = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };
  try {
    let {
      id,
      fullName,
      status,
      dob,
      age,
      gender,
      email,
      currentStandard,
      fatherName,
      motherName,
      fatherPhone,
      phone,
      residentialAddress,
      join_date,
      batchID,
      student_info,
      batch,
      attentanceStatus,
      attentanceDate,
      monthName,
      paymentOderID,
      paymentID,
      payment_status,
      paid_date,
      received_payment,
      paymentPerMonthTotal,
      paymentTotal,
      paymentDue,
      dueMonthCount,
      userName,
      password,
      confirm_password,
    } = req.body;

    if (password !== confirm_password) {
      return res.status(400).send("Passwords do not match");
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    console.log("password", password);

    payment_status = true;
    status = true;
    paid_date = `${day}/${month}/${year}`;
    attentanceStatus = false;
    attentanceDate = false;
    student_info = "new";
    monthName = months[today.getMonth() + 1];
    join_date = `${day}/${month}/${year}`;
    batchID = null;
    paid_date = `${day}/${month}/${year}`;
    paymentTotal = Math.floor(Number(received_payment) / 100);
    paymentDue = 0;
    dueMonthCount = 0;

    const imageUrls = `https://api-sanjeevani.konceptsdandd.com/ASSETS/studentRecords/${req.file.filename}`;

    const filename = req.file.filename;
    const counter = await Counter.findOneAndUpdate(
      { name: "studentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const studentID = `SSD${String(counter.seq).padStart(2, "0")}`;
    const newStudent = new studentsRecords({
      studentID: studentID,
      fullName,
      status,
      dob,
      age,
      gender,
      email,
      currentStandard,
      fatherName,
      motherName,
      fatherPhone,
      phone,
      residentialAddress,
      join_date,
      batchID,
      userName,
      password,
      student_info,
      batch,
      attentance: [
        {
          attentanceStatus: false,
          attentanceDate: null,
        },
      ],
      monthName,
      paymentOderID,
      paymentID,
      payment_status,
      paid_date,
      received_payment: Math.floor(Number(received_payment) / 100),
      paymentTotal,
      paymentDue,
      dueMonthCount,
      imageUrls: `https://api-sanjeevani.konceptsdandd.com/ASSETS/studentRecords/${req.file.filename}`,
      filename,
    });
    await newStudent.save();
    res.status(201).send(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//********************************update for students records********************************
const updateStudentsRecords = async (req, res) => {
  try {
    const updatedStudent = await studentsRecords.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//delete methode...................................

const deleteStudentsRecords = async (req, res) => {
  console.log("work");
  try {
    const student = await studentsRecords.findById(req.params.id);
    console.log(student);
    if (!student) {
      return res.status(404).json({ error: "Record not found" });
    }

    if (student.filename) {
      const filePath = path.join(
        __dirname,
        "../ASSETS/studentsRecords",
        student.filename
      );
      console.log(filePath);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting file:", err);
        }
      });
    }
    await studentsRecords.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllStudentsRecords,
  getSingleStudentsRecords,
  postStudentsRecords,
  updateStudentsRecords,
  deleteStudentsRecords,
};
