
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken")
const fs = require("fs");
const saltRounds = 10;
const User = require("../modal/userModel");
const userService = require("../services/userServices");
const bycrypt = require("bcrypt");
const JWT = require("../../Helper/jwt")



const userController = {
  getUser: async function (req, res) {
    let data = await User.find();
    let response = {
      success: 1,
      message: data,
    };
    res.send(response);
  },
  signupUser: async function (req, res) {
    const { companyName, name, email, number, password } = req.body;
    let response = {};
    try {
      if (!companyName || !name || !email || !number || !password) {
        throw new Error("Please provide all details");
      }

      // checking if email alredy exist
      let emailExist = await userService.checkUserExist({ email });
      if (emailExist) throw new Error("Email alredy used");

      // checking if Phone alredy exist
      let numberExist = await userService.checkUserExist({ number });
      if (numberExist) throw new Error("Number alredy used");

      // bycrypting the password
      let hashPassword = bycrypt.hashSync(password, saltRounds);

      // creating userId

      // creating user Object
      let user = {
        companyName: companyName,
        name: name,
        email: email,
        number: number,
        password: hashPassword,
      };
      let newUser = await userService.signup(user);
      if (!newUser) {
        throw new Error("Couldn't signup pls try again");
      }
      response = {
        success: 1,
        message: "User created Succesfully",
      };
    } catch (error) {
      response = {
        success: 0,
        message: `${error.message}`,
      };
      console.log(error);
    }
    res.send(response);
  },
  loginUser: async function (req, res) {
    const { email, password } = req.body;
    let response = {};
    try {
      if (!email || !password) {
        throw new Error("Pls provide all details for login");
      }
      let filter = { email };
      let user = await userService.loginUser(filter);
      if (!user) {
        throw new Error("No user with this email , pls signup for login");
      }
      let savePassword = user.password;
      //comparing the password
      let isPasswordMatch = bycrypt.compareSync(password, savePassword);

      if (!isPasswordMatch) throw new Error("wrong email or password");
      
      // creating Token for the login
      let token = jwt.sign({ payload: user }, "meeraki", {
        expiresIn: "5h",
      });

      response = {
        success: 1,
        message: "logged in successfully",
        token: token,
        user: user,

      };
    } catch (error) {
      response = {
        success: 0,
        message: `${error.message}`,
      };
      console.log(error);
    }
    res.send(response);
  },
  sendFile: async function (req, res) {
       try {
      // number defined for setting enquiryId
      let fileName = req.file.originalname;

      // now saving the data on db
      let obj = {
        fileName: `${fileName}`,
      };
      let enquiryData = await userService.enquiryFile(obj);

      res.send({
        status: 1,
        message: "File created successfully!!",
      });
    } catch (error) {
      console.log("Error in parsing file", error);
      return res.send({
        status: 0,
        message: "There was an error parsing the files",
      });
    }
  },
};

module.exports = userController;
