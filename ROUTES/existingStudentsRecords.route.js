const express=require("express")
const upload=require("../MULTER/studentsRecords.multer")
const mongoose = require("mongoose");

const {getAllExistingStudentsRecords,getSingleExistingStudentsRecords,postExistingStudentsRecords,postManualPayment,updateExistingStudentsRecords,postPayment,deleteExistingStudentsRecords} =require("../CONTROLLERS/existingStudentsRecords.controller")

const router=express.Router()

const validateObjectId = (req, res, next) => {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ObjectId" });
      }
      next();
    };
  
//get for all students records
router.get('/', getAllExistingStudentsRecords);

//get single student records
router.get('/:id', getSingleExistingStudentsRecords);


//post for student records
router.post('/',upload.single("image"),postExistingStudentsRecords);

//payment post.......................
router.post('/existStudentPayment',postPayment);

//payment post.......................
router.post('/existStudentManualPayment',postManualPayment);

//update for student records
router.put('/:id',upload.single("image"), updateExistingStudentsRecords);


//delete for student records
router.delete('/:id', deleteExistingStudentsRecords);




module.exports= router;
