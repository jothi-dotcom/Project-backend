const express = require("express");
const {getPayments,addPayment,markAsPaid,cancelPayment,deletePayment, saveDeliveryDetails, getDeliveryDetails,} = require("../controllers/PaymentController");
const { protect, admins } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/", protect, getPayments);
router.post("/", protect, addPayment);
router.put("/:id/paid", protect, admins, markAsPaid);
router.put("/:id/cancel", protect, cancelPayment);
router.delete("/:id", protect, admins, deletePayment);
// Delivery Routes
router.post("/delivery", protect, saveDeliveryDetails);
router.get("/delivery", protect, getDeliveryDetails);

module.exports = router;
