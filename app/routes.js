const express = require("express");

const {
  getUser,
  signupUser,
  loginUser,
} = require("./controller/userController");


const router = express.Router();

router.route("/allusers").get(getUser)
router.route("/signup").post(signupUser);
router.route("/signin").post(loginUser);



module.exports = router;
