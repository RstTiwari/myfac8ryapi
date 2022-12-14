
const express = require("express");
const userModel = require("../modal/userModel");

const router = express.Router();

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { companyName, name, email, number, password } = req.body;
  let user = {
    companyName: companyName,
    name: name,
    email: email,
    number: number,
    password: password,
  };
  let newUser = new userModel(user);
  await newUser.save(newUser);

  let response = {
    success: 1,
    message: newUser,
  };
  res.send(response);
});

module.exports = router;
