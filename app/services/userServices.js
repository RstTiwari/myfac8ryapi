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
            await  newUser.save()
            return success = 1;
        } catch (error) {
            console.log(error);
            return success = 0
        }
    }
}

module.exports = userService