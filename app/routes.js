const express = require("express");
const multer = require("multer");
const fs  = require("fs")
const {getUser ,signupUser ,loginUser,userEqnquiry} = require("./controller/userController")

const router = express.Router();
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"enquiry/")
    },
    filename:function(req, file,cb){
        cb(null ,file.originalname)
    }
})
const upload = multer({storage:storage})



router.route("/allusers").get(getUser)
router.route("/signup").post(signupUser);
router.route("/signin").post(loginUser)
router.route("/enquiry").post(upload.single("enquiryFile"), userEqnquiry);




module.exports = router