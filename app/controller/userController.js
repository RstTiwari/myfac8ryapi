const User = require("../modal/userModel");
const userService = require("../services/userServices");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
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
      
      let today = parseInt(Date.now()/1000)
      let user = {
        companyName: companyName,
        name: name,
        email: email,
        number: number,
        password: hashPassword,
        createdAt:today
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
    console.log(email, password);
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
    console.log(response);
    res.send(response);
  },
};

module.exports = userController;
