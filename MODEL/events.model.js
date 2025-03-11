const {model,Schema}=require("mongoose")

const schema=new Schema({
      events:[
            {
                  month:{type:String,require:true,},
                  eventsList:[
                        {
                              eventName:{
                                    type:String,
                                    require:true,
                              },
                              eventDate:{
                                    type:String,
                                    require:true,            
                              },
                              remarks:{
                                    type:String,
                                    require:true,            
                              },
                              time:{
                                    type:String,
                                    require:true,            
                              }
                        }
                  ]
            }
      ]

})

const events=model("events",schema)
module.exports=events