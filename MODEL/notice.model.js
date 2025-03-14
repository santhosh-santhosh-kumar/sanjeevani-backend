const {model,Schema}=require("mongoose")

const schema=new Schema({
      notice:{
            type:String,
           
      },
      remark:{
            type:String,
           
      }

})

const notice=model("notice",schema)
module.exports=notice