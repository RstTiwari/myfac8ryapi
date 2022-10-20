const User = require("../modal/userModel");
const userService = require("../services/userServices");
const bycrypt = require("bcrypt");
const { response } = require("express");
const saltRounds = 10;

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
    let response ={}
    try {
      if (!companyName || !name || !email || !number || !password) {
          throw new Error("Please provide all details")
      } else {
        // bycrypting the password
        let hashPassword = bycrypt.hashSync(password, saltRounds);

        // creating user Object
        let user = {
          companyName: companyName,
          name: name,
          email: email,
          number: number,
          password: hashPassword,
        };
        let newUser = await userService.signup(user);
        if (newUser === 0) {
             throw new Error("user can not be Created")
        } 
        let response = {
            success: 1,
            message: "user Created succefully",
          };
      

        res.send(response);
      }
    } catch (error) {
      console.log(error);
    }
  },
  loginUser: async function (req, res) {
    const { email, password } = req.body;
    try {
      if (email && password) {
        let filter = { email };
        let user = await userService.loginUser(filter);
        if (!user) {
          throw new Error("wrong email and password");
        }
        let savePassword = user.password;
        //comparing the password
        let isPasswordMatch = bycrypt.compareSync(password, savePassword);

        if (!isPasswordMatch) {
          res.send({
            success: 0,
            message: "please enter valid email and password",
          });
        }
        let response = {
          success: 1,
          message: "you logged in successfully",
        };
        res.send(response);
      } else {
        let response = {
          success: 0,
          message: "please enter email and password",
        };
        res.send(response);
      }
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = userController;
