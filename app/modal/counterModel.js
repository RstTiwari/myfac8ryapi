const mongoose = require("mongoose");

const counterSchema = mongoose.Schema({
  
    counterName:{
        type:String,
        required:true
    },
    counterSeq:{
        type:Number,
        required:true,
    }

});

module.exports = mongoose.model("counter", counterSchema);
