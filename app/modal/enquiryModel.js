const mongoose = require("mongoose")


const enquirySchema = new mongoose.Schema({
    enquiryNo:{
        type:"Number",
        require:true
    },
    companyName:{
         type:"String",
         require:true
    }

})


module.exports = mongoose.model("enquiry",enquirySchema,"enquiry")