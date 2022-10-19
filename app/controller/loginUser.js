const express = require("express");
const user = require("../modal/userModel");

const router = express.Router();

router.post("/login")