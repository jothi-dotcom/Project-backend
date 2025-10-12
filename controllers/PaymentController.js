const Payment = require("../models/PaymentModel");
const Delivery = require("../models/deliveryModel");

// 🧾 Get payments
const getPayments = async (req, res) => {
  try {
    let payments;

    if (req.user.role === "admin") {
      payments = await Payment.find().populate("user", "username email");
    } else {
      payments = await Payment.find({ user: req.user._id });
    }

    res.json(payments);
  } catch (err) {
    console.error("Get Payments Error:", err);
    res.status(500).json({ message: "Server error while fetching payments" });
  }
};

// 💳 Add a new payment
const addPayment = async (req, res) => {
  try {
    const { cardName, cardNumber, expiry, amount, delivery } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // 🏠 Handle delivery details safely
    let userDelivery = await Delivery.findOne({ user: req.user._id });

    if (delivery && typeof delivery === "object") {
      if (userDelivery) {
        Object.assign(userDelivery, delivery);
        await userDelivery.save();
      } else {
        userDelivery = await Delivery.create({ user: req.user._id, ...delivery });
      }
    } else if (!userDelivery) {
      // Create empty delivery if none exists at all
      userDelivery = await Delivery.create({
        user: req.user._id,
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
      });
    }

    // 💰 Create payment linked to delivery
    const newPayment = await Payment.create({
      user: req.user._id,
      cardName,
      cardNumber,
      expiry,
      amount,
      status: "pending",
      delivery: userDelivery._id,
    });

    res.status(201).json(newPayment);
  } catch (err) {
    console.error("Add Payment Error:", err);
    res.status(500).json({ message: "Server error while adding payment" });
  }
};

// 🟢 Mark payment as paid (admin)
const markAsPaid = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "paid";
    await payment.save();

    res.json({ message: "Payment marked as paid", payment });
  } catch (err) {
    console.error("Mark Paid Error:", err);
    res.status(500).json({ message: "Server error while marking payment as paid" });
  }
};

// 🔴 Cancel payment (user)
const cancelPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found or not yours" });
    }

    if (payment.status === "paid") {
      return res.status(400).json({ message: "Cannot cancel a paid payment" });
    }

    payment.status = "cancelled";
    await payment.save();

    res.json({ message: "Payment cancelled successfully", payment });
  } catch (err) {
    console.error("Cancel Payment Error:", err);
    res.status(500).json({ message: "Server error while cancelling payment" });
  }
};

// 🗑️ Delete payment (admin)
const deletePayment = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.deleteOne();
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("Delete Payment Error:", err);
    res.status(500).json({ message: "Server error while deleting payment" });
  }
};

// 📦 Save or update delivery details
const saveDeliveryDetails = async (req, res) => {
  try {
    const { fullName, address, city, postalCode, phone } = req.body;

    let delivery = await Delivery.findOne({ user: req.user._id });

    if (delivery) {
      delivery.fullName = fullName;
      delivery.address = address;
      delivery.city = city;
      delivery.postalCode = postalCode;
      delivery.phone = phone;
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
    console.error("Save Delivery Error:", err);
    res.status(500).json({ message: "Server error while saving delivery" });
  }
};

// 🚚 Get delivery details for logged-in user
const getDeliveryDetails = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ user: req.user._id });
    if (!delivery)
      return res.status(404).json({ message: "No delivery details found" });

    res.json(delivery);
  } catch (err) {
    console.error("Get Delivery Error:", err);
    res.status(500).json({ message: "Server error while fetching delivery details" });
  }
};

module.exports = {
  getPayments,
  addPayment,
  markAsPaid,
  cancelPayment,
  deletePayment,
  saveDeliveryDetails,
  getDeliveryDetails,
};
