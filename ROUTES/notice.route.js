const express=require("express")

const {getAllNotice,getSingleNotice,postNotice,putNotice,deleteNotice} =require("../CONTROLLERS/notice.controller")

const router=express.Router()

//get for all students records
router.get('/', getAllNotice);

//get single student records
router.get('/:id', getSingleNotice);


//post for student records
router.post('/',postNotice);


//update for student records
router.put('/:id', putNotice);


//delete for student records
router.delete('/:id', deleteNotice);




module.exports= router;
