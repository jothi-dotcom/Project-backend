const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fullName:
        {
            type: String,
            required: true
        },
        address:
        {
            type: String,

            required: true
        },
        city:
        {
            type: String,
            required: true
        },
        postalCode:
        {
            type: String,
            required: true
        },
        phone:
        {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

const Delivery = mongoose.model("Delivery", deliverySchema);
module.exports = Delivery;
