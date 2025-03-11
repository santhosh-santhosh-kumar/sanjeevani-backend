const { Schema,model} = require("mongoose");

const schema=new Schema({

      plan:String,
      price:Number,
      status:{type:Boolean,default:true}
      // name:String,
      // age:Number,
      // dob:Number,
      // mob:Number,
      // gender:String,
      // father_name:String,
      // mother_name:String,
      // address:String,
      // email:String,
      // payment:Number,
      // status:{type:Boolean,default:true},
      // createdAt:{type:Date,default:Date.now()}
})

const paymentModel = model("paymentModel", schema);
module.exports = { paymentModel };