const express = require("express")
const router = express.Router()

const getUser = require("./controller/alluser")
const createUser = require("./controller/create");



router.get("/alluser",getUser)
router.post("/signup", createUser);



module.exports = router