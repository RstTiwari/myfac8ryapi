const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  number: {
    type: Number,
    unique: true,
    required: [true, "Please Enter Your Number"],
    maxLength: [10, "Number cannot exceed 10 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  industryType :{
    type:string
  }
,
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Number,
  },
});

module.exports = mongoose.model("user", userSchema);
