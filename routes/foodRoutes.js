const express =require("express");
const { createFood, getfoodByhotel, updateFood, deleteFood } =require("../controllers/foodController");
const { protect, admins } =require("../middleware/authMiddleware");

const router =express.Router();

router.post("/" ,protect,admins,createFood);
router.get("/:hotelID" ,getfoodByhotel);
router.put("/:id",protect,admins ,updateFood);
router.delete("/:id",protect,admins,deleteFood)

module.exports =router;