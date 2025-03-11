const express=require("express")

const {getPayments,allPayments} =require("../CONTROLLERS/payments.controller")

const router=express.Router()

//get for banner images
router.get('/', getPayments);

//get single videos for images videos
router.get('/paymentsall', allPayments);


module.exports= router;
