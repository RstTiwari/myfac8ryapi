const express = require("express")
const router = express.Router();
const multer = require("multer");

const {
  getUser,
  signupUser,
  loginUser,
  sendFile,
} = require("./controller/userController");


const storage = multer.diskStorage({
    destination:function(req, file ,cb){
        cb(null, `${__dirname}/enquiry`)
    },
    filename:function(req,file,cb){
        cb(null , file.originalname)
    },
    limits:{
        fileSize:5*1024*1024 // 5

    }
})

const upload = multer({storage:storage})



router.route("/allusers").get(getUser)
router.route("/signup").post(signupUser);
router.route("/signin").post(loginUser)
router.route("/sendfile").post(upload.single("enquiryFile"), sendFile);



module.exports = router;
