const express = require("express");
const upload = require("../MULTER/studentsRecords.multer");

const {
  getAllStudentsRecords,
  getSingleStudentsRecords,
  postStudentsRecords,
  updateStudentsRecords,
  deleteStudentsRecords,
} = require("../CONTROLLERS/studentsRecords.controller");

const router = express.Router();

//get for all students records
router.get("/entroll", getAllStudentsRecords);

//get single student records
router.get("/entroll/:id", getSingleStudentsRecords);

//post for student records
router.post("/entroll", upload.single("image"), postStudentsRecords);

//update for student records
router.put("/entroll/:id", updateStudentsRecords);

//delete for student records
router.delete("/entroll/:id", deleteStudentsRecords);

module.exports = router;
