const express = require("express");
const { placeOrder, getUserOrders, cancelOrder, updateOrder, deleteOrder }=require("../controllers/orderController");
const { protect, admins } = require("../middleware/authMiddleware")

const router =express.Router();

router.post("/" ,protect,  placeOrder);
router.get("/" ,protect,getUserOrders);
router.put("/:orderId/cancel",protect,cancelOrder);
router.put("/:id",protect ,updateOrder);
router.delete("/:id",protect ,deleteOrder);


module.exports=router;