const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardName: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    expiry: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "unpaid", "paid", "cancelled"],
      default: "pending",
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
    },
    amount:
    {
      type: Number,
      required: true
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
