const User = require("../modal/userModel");

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
    let user = {
      companyName: companyName,
      name: name,
      email: email,
      number: number,
      password: password,
    };
    let newUser = new User(user);
    await newUser.save(newUser);

    let response = {
      success: 1,
      message: newUser,
    };
    res.send(response);
  },
};

module.exports = userController;
