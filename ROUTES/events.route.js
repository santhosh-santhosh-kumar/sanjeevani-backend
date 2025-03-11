const express=require("express")

const {getAllEvents,getSingleEvents,postEvents,putEvents,deleteEvents} =require("../CONTROLLERS/events.controller")

const router=express.Router()

//get for all students records
router.get('/', getAllEvents);

//get single student records
router.get('/:id', getSingleEvents);


//post for student records
router.post('/',postEvents);


//update for student records
router.put('/:id', putEvents);


//delete for student records
router.delete('/:id', deleteEvents);




module.exports= router;
