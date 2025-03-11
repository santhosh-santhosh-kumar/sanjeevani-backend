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
      }
})

const studentUser=model("studentUser",schema)
module.exports=studentUser