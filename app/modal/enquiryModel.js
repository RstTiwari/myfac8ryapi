const mongoose = require("mongoose");

const enquirySchema = mongoose.Schema({
    enquiryId:{
        type:Number,
    },
    fileName:{
        type:String,
        require:true,
    }
    ,createdAt:{
        type:Number,
        default:parseInt(Date.now()/100)
    }
 
});

module.exports = mongoose.model("enquiry", enquirySchema);
