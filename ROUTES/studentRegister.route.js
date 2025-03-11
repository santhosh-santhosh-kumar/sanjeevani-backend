const express=require("express");
const {getRegister,getSingleRegister,postRegister,updateRegister,deleteRegister}=require("../CONTROLLERS/studentRegister.controller");


const router=express.Router()

//get for banner images
router.get('/', getRegister);

//get single videos for images videos
router.get('/:id', getSingleRegister);


//post for images video
router.post('/',postRegister);

//put for register
router.put('/:id', updateRegister);


//delete for images videos
router.delete('/:id', deleteRegister);

module.exports= router;
