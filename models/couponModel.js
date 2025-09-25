const mongoose= require ("mongoose");

const couponSchema =new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true
    },
    discountPercentage:{
        type:Number,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true
    }
});

const Coupon = mongoose.model("Coupon" , couponSchema);
module.exports=Coupon;