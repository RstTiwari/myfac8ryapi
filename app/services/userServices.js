const userModal = require("../modal/userModel")
const enquiryModal = require("../modal/enquiryModel")

const userService = {
    loginUser:async function (filter){
        let data = {};
        try {
            data = userModal
              .findOne(filter)
              .select("+password")
              .read("secondaryPreferred")
              .lean();
            
        } catch (error) {
            console.log(error)
        }
        return data
        

    },

    signup:async function (user){
        try {
            let newUser = new userModal(user)
            return await  newUser.save()
        } catch (error) {
            console.log(error);
            return success = 0
        }
    },

    checkUserExist :async function (filter){
        let data = {}
        try{
            data = await userModal
              .findOne(filter)
              .select()
              .sort()
              .skip()
              .limit()
              .read("secondaryPreferred")
              .lean();
        }catch(e){
            console.log(e)
        }
        return data

    },

    createEnquiry : async function (obj){
        let data = null
        try {
            data =  new enquiryModal(obj)
            await data.save()
        } catch (error) {
            console.error(error)
        }
        return data
    }
}

module.exports = userService