const mongoose = require("mongoose");

const enquirySchema = mongoose.Schema({
    enquiryId:{
        type:Number,
    },
    fileName:{
        type:String,
        require:true,
    }
 
});

module.exports = mongoose.model("enquiry", enquirySchema);
