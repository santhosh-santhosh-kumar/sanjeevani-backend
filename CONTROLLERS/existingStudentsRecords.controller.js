const existingStudentsRecords = require("../MODEL/existingStudentsRecords.model");
const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");
const cron = require("node-cron");

//get methode - all.................................
const getAllExistingStudentsRecords = async (req, res) => {
  try {
    const getAllExistingStudentsRecords = await existingStudentsRecords.find();
    res.status(200).send(getAllExistingStudentsRecords);
  } catch (err) {
    res.status(404).send({ err: err.message });
  }
};

//corn scuhedule for update students payment status = false...................

// cron.schedule("* * * 1 *", async () => {
//   try {
//     await existingStudentsRecords.updateMany(
//       { payment_status: true },
//       { $set: { payment_status: false } }
//     );
//   } catch (error) {
//     console.error(error);
//   }
// });

//get methode - single..............................................

const getSingleExistingStudentsRecords = async (req, res) => {
  try {
    const getStudentRecord = await existingStudentsRecords.findById(
      req.params.id
    );
    res.status(200).json(getStudentRecord);
  } catch (err) {
    res.status(401).json({ err: err.message });
  }
};

//post methode for adding existing students..........................................

const postExistingStudentsRecords = async (req, res) => {
  const today = new Date();
  let {
    studentID,
    status,
    fullName,
    dob,
    age,
    gender,
    email,
    currentStandard,
    fatherName,
    motherName,
    fatherPhone,
    phone,
    individuals,
    residentialAddress,
    join_date,
    batchID,
    userName,
    password,
    conform_password,
    student_info,
    attentancemonth,
    attentanceStatus,
    attentanceDate,
    monthName,
    paymentOderID,
    paymentID,
    payment_status,
    paid_date,
    paymentRecords,
    received_payment,
    paymentTotal,
    paymentDue,
    dueMonthCount,
    leaveMonth,
    reason,
    noOfDaysLeave,
    leaveDate,
    imageUrls,
    filename,
  } = req.body;

  console.log("req.body", req.body);
  // console.log("req.file", req.file);
  console.log(paymentRecords, received_payment);
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

  let monthCount = today.getMonth() + 1;
  let monthlyFee = received_payment;
  if (req.file) {
    imageUrls = `https://api-sanjeevani.konceptsdandd.com/ASSETS/studentRecords/${req.file.filename}`;
    filename=req.file.filename
  } else {
    imageUrls = req.body.imageUrls;
    filename = req.body.filename;
  }

  // console.log(imageUrl);
  // const filename = req.file.filename;

  try {
    //find student Records...........................

    const findStudentId = await existingStudentsRecords.findOne({
      studentID: studentID,
    });

    //if student not found...................
    if (!findStudentId) {
      console.log("student not found");
      paymentTotal = received_payment;
      paymentDue = 0;
      dueMonthCount = 0;
      leaveMonth = today.getMonth() + 1;

      const newStudent = new existingStudentsRecords({
        studentID,
        status,
        fullName,
        dob,
        age,
        gender,
        email,
        currentStandard,
        fatherName,
        motherName,
        fatherPhone,
        phone,
        individuals,
        residentialAddress,
        join_date,
        batchID,
        userName,
        password,
        conform_password,
        student_info,
        attentance: [
          {
            attentancemonth: months[today.getMonth() + 1],
            details: [
              {
                attentanceStatus,
                attentanceDate,
              },
            ],
          },
        ],
        paymentRecords: [
          {
            monthName: months[today.getMonth() + 1],
            paymentOderID,
            paymentID,
            payment_status: true,
            paid_date: `${day}/${month}/${year}`,
            received_payment,
          },
        ],
        paymentTotal,
        paymentDue: 0,
        dueMonthCount: 0,
        leaveUpdation: [
          {
            leaveMonth,
            updates: [
              {
                reason,
                noOfDaysLeave,
                leaveDate,
              },
            ],
          },
        ],
        imageUrls,
        filename,
      });

      await newStudent.save();
      res.status(201).send(newStudent);
      console.log("New student records add................");
    } else {
      console.log("student  found");
      // if student already exist.........................

      //while amount paid ..............................
      if (paymentID) {
        console.log("Payment id......................");
        let updatedPaymentTotal = findStudentId.paymentTotal + received_payment;
        console.log("Payment id......................1");
        let updatedPaymentDue = Math.max(
          0,
          findStudentId.dueMonthCount * monthlyFee - updatedPaymentTotal
        );
        let updatedDueMonthCount;

        updatedDueMonthCount = Math.ceil(updatedPaymentDue / received_payment);
        console.log("Payment id......................2");
        findStudentId.paymentRecords.push({
          monthName: months[today.getMonth() + 1],
          paymentOderID,
          paymentID,
          payment_status,
          paid_date: `${day}/${month}/${year}`,
          received_payment: received_payment,
        });
        console.log("Payment id......................3");
        console.log(
          updatedPaymentTotal,
          updatedPaymentDue,
          updatedDueMonthCount
        );
        findStudentId.paymentTotal = updatedPaymentTotal;
        findStudentId.paymentDue = updatedPaymentDue;
        // findStudentId.dueMonthCount = updatedDueMonthCount;

        findStudentId.markModified("paymentRecords");
      }

      //while attentance update...................

      if (attentanceStatus) {
        attentancemonth = months[today.getMonth() + 1];
        console.log("attentanceStatus......................");
        let attentanceEntry = findStudentId.attentance.find(
          (entry) => entry.attentancemonth === attentancemonth
        );
        if (attentanceEntry) {
          console.log("attentanceEntry.....................");
          attentanceEntry.details.push({
            attentanceStatus,
            attentanceDate: `${day}/${month}/${year}`,
          });
        } else {
          console.log("new attentanceEntry.....................");
          findStudentId.attentance.push({
            attentancemonth,
            details: [
              { attentanceStatus, attentanceDate: `${day}/${month}/${year}` },
            ],
          });
        }
        findStudentId.markModified("attentance");
      }

      //Leave update.....................

      if (leaveMonth) {
        console.log("eaveMonth......................");
        let leaveEntry = findStudentId.leaveUpdation.find(
          (entry) => entry.leaveMonth === leaveMonth
        );

        if (leaveEntry) {
          leaveEntry.updates.push({ reason, noOfDaysLeave, leaveDate });
        } else {
          findStudentId.leaveUpdation.push({
            leaveMonth,
            updates: [{ reason, noOfDaysLeave, leaveDate }],
          });
        }
        findStudentId.markModified("leaveUpdation");
      }

      await findStudentId
        .save()
        .then(() => console.log("Student records updated and saved in MongoDB"))
        .catch((err) => console.error(" Error saving Students:", err));
      res.status(200).send("Student records updated");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//********************************update for students records********************************
const updateExistingStudentsRecords = async (req, res) => {
  try {
    const updatedStudent = await existingStudentsRecords.findByIdAndUpdate(
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

const deleteExistingStudentsRecords = async (req, res) => {
  try {
    const student = await existingStudentsRecords.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Record not found" });
    }

    if (student.image) {
      const filePath = path.join(
        __dirname,
        "../ASSETS/existingStudentsRecords",
        student.image
      );
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting file:", err);
        }
      });
    }
    await existingStudentsRecords.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllExistingStudentsRecords,
  getSingleExistingStudentsRecords,
  postExistingStudentsRecords,
  updateExistingStudentsRecords,
  deleteExistingStudentsRecords,
};
