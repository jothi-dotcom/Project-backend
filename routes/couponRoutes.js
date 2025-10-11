const express = require("express");
const{ createCoupon, applyCoupon, updateCoupon, deleteCoupon, getCoupon } = require ("../controllers/couponController");
const { protect, admins } =require("../middleware/authMiddleware");

const router = express.Router();

router.post("/" ,protect,admins,createCoupon);
router.get("/" ,protect,getCoupon)
router.post("/apply",applyCoupon);
router.put("/:id",protect,admins,updateCoupon);
router.delete("/:id",protect,admins,deleteCoupon)

module.exports=router;