const Payment = require("../models/PaymentModel");
const Delivery = require("../models/deliveryModel");

// Helper: Check user
const ensureUser = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized: User not found" });
    return false;
  }
  return true;
};

// GET all payments
const getPayments = async (req, res) => {
  try {
    if (!ensureUser(req, res)) return;

    const payments =
      req.user.role === "admin"
        ? await Payment.find().populate("user", "username email")
        : await Payment.find({ user: req.user._id });

    res.json(payments);
  } catch (err) {
    console.error("getPayments Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ADD payment
const addPayment = async (req, res) => {
  try {
    if (!ensureUser(req, res)) return;

    const { cardName, cardNumber, expiry, amount } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const delivery = await Delivery.findOne({ user: req.user._id });

    const newPayment = await Payment.create({
      user: req.user._id,
      cardName,
      cardNumber,
      expiry,
      amount,
      status: "pending",
      delivery: delivery ? delivery._id : null,
    });

    res.status(201).json(newPayment);
  } catch (err) {
    console.error("addPayment Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// CANCEL payment
const cancelPayment = async (req, res) => {
  try {
    if (!ensureUser(req, res)) return;

    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!payment)
      return res.status(404).json({ message: "Payment not found or not yours" });

    if (payment.status === "paid")
      return res.status(400).json({ message: "Cannot cancel a paid payment" });

    payment.status = "cancelled";
    await payment.save();

    res.json({ message: "Payment cancelled successfully", payment });
  } catch (err) {
    console.error("cancelPayment Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE payment (admin only)
const deletePayment = async (req, res) => {
  try {
    if (!ensureUser(req, res)) return;
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admins only" });

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.deleteOne();
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("deletePayment Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// MARK payment as PAID (admin only)
const markAsPaid = async (req, res) => {
  try {
    if (!ensureUser(req, res)) return;
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admins only" });

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "paid";
    await payment.save();

    res.json({ message: "Payment marked as paid", payment });
  } catch (err) {
    console.error("markAsPaid Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// SAVE or UPDATE delivery details
const saveDeliveryDetails = async (req, res) => {
  try {
    if (!ensureUser(req, res)) return;

    const { fullName, address, city, postalCode, phone } = req.body;

    let delivery = await Delivery.findOne({ user: req.user._id });

    if (delivery) {
      Object.assign(delivery, { fullName, address, city, postalCode, phone });
      await delivery.save();
    } else {
      delivery = await Delivery.create({
        user: req.user._id,
        fullName,
        address,
        city,
        postalCode,
        phone,
      });
    }

    res.json({ message: "Delivery details saved successfully", delivery });
  } catch (err) {
    console.error("saveDeliveryDetails Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET delivery details
const getDeliveryDetails = async (req, res) => {
  try {
    if (!ensureUser(req, res)) return;

    const delivery = await Delivery.findOne({ user: req.user._id });
    res.json(delivery || null);
  } catch (err) {
    console.error("getDeliveryDetails Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Export all functions
module.exports = {
  getPayments,
  addPayment,
  cancelPayment,
  deletePayment,
  markAsPaid,
  saveDeliveryDetails,
  getDeliveryDetails,
};
