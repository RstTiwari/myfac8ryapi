const express = require("express");
const user = require("../userModel");

const router = express.Router();

router.get("/alluser", async (req, res) => {
  let data = await user.find();
  let response = {
    success: 1,
    message: data,
  };
  res.send(response);
});

module.exports = router;
