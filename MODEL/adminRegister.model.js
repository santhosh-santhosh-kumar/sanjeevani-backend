const {model,Schema}=require("mongoose")

const schema=new Schema({
      userName:{
            type:String,
            require:true,
      },
      password:{
            type:String,
            require:true,            
      },
      confirm_password:{
            type:String,
            require:true,            
      },
      fullName : { type: String },
      phone : { type: Number },
      email : { type: String },
      address : { type: String },
      imageUrls: { type: String },
      fileName: { type: String },
})

const adminUser=model("adminUser",schema)
module.exports=adminUser