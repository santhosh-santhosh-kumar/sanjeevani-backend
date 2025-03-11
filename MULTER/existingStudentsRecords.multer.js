const multer =require("multer");
const path =require('path')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "ASSETS/existingStudentsRecords")        },
    filename:(req,file,cb)=>{
    cb(null,file.fieldname+'_'+Date.now()+path.extname(file.originalname))
    }
})
const uploadImage = multer({ storage });

module.exports = uploadImage;
