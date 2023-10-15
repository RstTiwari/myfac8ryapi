const express = require("express");
const multer = require("multer");
const fs  = require("fs")
const {
  getUser,
  signupUser,
  loginUser,
  userEqnquiry,
  getProjectList,
  addProject,
  getSingleProject,
  bestSellingProject
} = require("./controller/userController");

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
router.route("/projectList").post(getProjectList);
router.route("/addProject").post(addProject);
router.route("/getSingleProject").post(getSingleProject);
router.route("/bestsellingProject").post(bestSellingProject)








module.exports = router