const userModal = require("../modal/userModel")
const Enquiry = require("../modal/enquiryModel")
const counter = require("../modal/counterModel")

const userService = {
  loginUser: async function (filter) {
    let data = {};
    try {
      data = userModal
        .findOne(filter)
        .select("+password")
        .read("secondaryPreferred")
        .lean();
    } catch (error) {
      console.log(error);
    }
    return data;
  },
  signup: async function (user) {
    try {
      let newUser = new userModal(user);
      return await newUser.save();
    } catch (error) {
      console.log(error);
      return (success = 0);
    }
  },
  checkUserExist: async function (filter) {
    let data = {};
    try {
      data = await userModal.findOne(filter);
    } catch (e) {
      console.log(e);
    }
    return data;
  },
  enquiryFile: async function (obj) {
    let newEnquiry = new Enquiry(obj);
    let data = await newEnquiry.save();
    return data;
  },
  getCounter: async function (counterName) {
    return counter.findOneAndUpdate(
      { counterName: counterName },
      {
        $inc: { counterSeq: 1 },
      },
      { new: true, lean: true, useFindAndModify: false }
    );
  },
  getExistingFile: async function (fileName){
    let data = 0
    try {
       data = await Enquiry.count({fileName:fileName}).lean()
    } catch (error) {
      console.log(error)
      
    }
    return data
  }
};

module.exports = userService