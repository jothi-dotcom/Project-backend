const express = require("express");
const { placeOrder, getUserOrders,getAllOrders, cancelOrder, updateOrder, deleteOrder }=require("../controllers/orderController");
const { protect, admins } = require("../middleware/authMiddleware")

const router =express.Router();

router.post("/" ,protect,  placeOrder);
router.get("/" ,protect,getUserOrders);
router.get("/admin" ,protect,admins,getAllOrders);
router.put("/:orderId/cancel",protect,cancelOrder);
router.put("/:id",protect ,admins,updateOrder);
router.delete("/:id",protect ,deleteOrder);


module.exports=router;