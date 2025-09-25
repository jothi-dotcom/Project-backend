const Coupon = require("../models/couponModel");


// Create Coupon 
createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getCoupon = async (req,res) =>{
    try{
        const coupons =await Coupon.find();
        res.status(200).json(coupons);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

applyCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) return res.status(400).json({ message: "Invalid or expired coupon" });
    if (coupon.expiry < new Date()) return res.status(400).json({ message: "Coupon expired" });

    const discount = (totalAmount * coupon.discountPercentage) / 100;
    const finalAmount = totalAmount - discount;

    res.json({ discount, finalAmount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Coupon updated", updatedCoupon });
  } catch {
    res.status(500).json({ message: "Server error: network connection failed" });
  }
};
const deleteCoupon = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Coupon deleted", deletedCoupon });
  } catch {
    res.status(500).json({ message: "Server error: network connection failed" });
  }
};



module.exports ={createCoupon ,applyCoupon ,updateCoupon,deleteCoupon,getCoupon};