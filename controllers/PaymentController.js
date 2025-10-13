const Payment = require("../models/PaymentModel");
const Delivery =require("../models/deliveryModel");

//  Get payments
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
    res.status(500).json({ message: "Server error" });
  }
};

const addPayment = async (req, res) => {
  try {
    const { cardName, cardNumber, expiry, amount, delivery } = req.body; // 💰 include amount

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Save/update delivery first
    let userDelivery = await Delivery.findOne({ user: req.user._id });
    if (userDelivery) {
      Object.assign(userDelivery, delivery);
      await userDelivery.save();
    } else {
      userDelivery = await Delivery.create({ user: req.user._id, ...delivery });
    }

    // Create payment and link delivery
    const newPayment = await Payment.create({
      user: req.user._id,
      cardName,
      cardNumber,
      expiry,
      amount, // 💰 store amount
      status: "pending",
      delivery: userDelivery._id,
    });

    res.status(201).json(newPayment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



//  Mark payment as paid (admin)
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
    res.status(500).json({ message: "Server error" });
  }
};

//  Cancel payment 
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
    res.status(500).json({ message: "Server error" });
  }
};

// Delete payment 
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
    res.status(500).json({ message: "Server error" });
  }
};

const saveDeliveryDetails = async (req, res) => {
  try {
    const { fullName, address, city, postalCode, phone } = req.body;

    let delivery = await Delivery.findOne({ user: req.user._id });

    if (delivery) {
      // Update existing delivery
      delivery.fullName = fullName;
      delivery.address = address;
      delivery.city = city;
      delivery.postalCode = postalCode;
      delivery.phone = phone;
      await delivery.save();
    } else {
      // Create new delivery record
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get delivery details for logged-in user
const getDeliveryDetails = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ user: req.user._id });
    if (!delivery) return res.status(404).json({ message: "No delivery details found" });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {getPayments,addPayment,markAsPaid,cancelPayment,deletePayment,saveDeliveryDetails,getDeliveryDetails};
