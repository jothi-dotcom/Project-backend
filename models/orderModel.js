const mongoose =require("mongoose");

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    items:[{
        food:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"food",
            required:true
        },
        quantity:{
            type:Number,
            required:true,min:1
        }
    }],
    totalamount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","confirmed","delivered","cancelled"]
    },
    coupon:{
        type:String,
        default:null
        }
    
    

    
});

const Order = mongoose.model("Order" ,orderSchema);
module.exports=Order;