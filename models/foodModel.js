const mongoose =require("mongoose");


const foodSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,

    },
    price:{
        type:Number,
        required:true

    },
    image:{
        type:String
    },
    hotel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel",
        required:true
    },
    category:{
        type:String,
        enum:["veg" ,"non-veg","beverage","dessert"],
        
    },
    avaliable:{
        type:Boolean,
        default:true
    }

});

const Food = mongoose.model("Food", foodSchema);
module.exports =Food;