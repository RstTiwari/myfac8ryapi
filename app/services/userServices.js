const userModal = require("../modal/userModel")

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
            data = await userModal.findOne(filter)
        }catch(e){
            console.log(e)
        }
        return data

    }
}

module.exports = userService