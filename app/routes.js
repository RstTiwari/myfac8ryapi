const express = require("express");

const {
  getUser,
  signupUser,
  loginUser,
} = require("./controller/userController");

const auth = require("../Helper/auth")

const router = express.Router();

router.route("/alluser").get(auth.validate,getUser);
router.route("/signup").post(signupUser);
router.route("/signin").post(loginUser);



module.exports = router;
