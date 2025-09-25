const express = require("express");
const { createHotel, getHotel, updateHotel, deleteHotel }=require("../controllers/hotelController");
const { protect,admins }=require("../middleware/authMiddleware");

const router =express.Router();

router.post("/" ,protect,admins,createHotel);
router.get("/" ,getHotel);
router.put("/:id" ,protect,admins,updateHotel);
router.delete("/:id",protect,admins,deleteHotel);

module.exports= router;