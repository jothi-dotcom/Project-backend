const mongoose=require("mongoose")

const hotelSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    description:{
        type:String,

    },
    image:{
        type:String
    },


});

const Hotel = mongoose.model("Hotel" ,hotelSchema);
module.exports= Hotel;