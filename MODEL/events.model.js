const {model,Schema}=require("mongoose")

const schema=new Schema({
      title:{
            type:String,
           
      },
      date:{
            type:String,
            
      },
      batch:{
            type:String,
               
      },
      starttime:{
            type:String,
              
      },
      endtime:{
            type:String,
           
      },
      remarks:{
            type:String,
           
      }

})

const events=model("events",schema)
module.exports=events