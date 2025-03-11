const express=require("express")
const upload=require("../MULTER/existingStudentsRecords.multer")

const {getAllExistingStudentsRecords,getSingleExistingStudentsRecords,postExistingStudentsRecords,updateExistingStudentsRecords,deleteExistingStudentsRecords} =require("../CONTROLLERS/existingStudentsRecords.controller")

const router=express.Router()

//get for all students records
router.get('/', getAllExistingStudentsRecords);

//get single student records
router.get('/:id', getSingleExistingStudentsRecords);


//post for student records
router.post('/',upload.single("image"),postExistingStudentsRecords);


//update for student records
router.put('/:id', updateExistingStudentsRecords);


//delete for student records
router.delete('/:id', deleteExistingStudentsRecords);




module.exports= router;
