const Order =require("../models/orderModel");

// Place Order
const placeOrder = async (req, res) => {
  try {
    const { items, totalamount, coupon } = req.body;
    const order = await Order.create({
      user: req.user._id,
      items,
      totalamount,
      coupon,
    });
    res.status(201).json({message: "Order Succesfully" ,order});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Orders of Logged In User
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate({
    path:"items.food",
    model:"Food"})
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get all orders 
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({ path: "user", select: "username email" })
      .populate({ path: "items.food", model: "Food" });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order s
const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
     res.status(200).json({ message: "Order deleted", deletedOrder });
  } catch {
    res.status(500).json({ message: "Server error: network connection failed" });
  }
};

// Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={placeOrder,getUserOrders,cancelOrder ,updateOrder,deleteOrder,getAllOrders};
