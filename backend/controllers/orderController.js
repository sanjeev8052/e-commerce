const Order = require("../models/orderModel");
const Product = require("../models/Product");

exports.newOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found..." });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

exports.myOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

// get all order --- admin

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

// update order status --- Admin

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found..." });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "You have already delivered this order",
      }) ;
    }

    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });

    order.orderStatus = req.body.status;

    if (order.orderStatus === "Delivered") {
      order.deliverdAt = Date.now();
    }

    res.status(200).json({
      success: true,
    });

    await order.save({ validateBeforeSave: false });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// Delete Order--- Admin

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found..." });
    }

    await order.remove();

    res.status(200).json({
      success: true,
    });

    await order.save({ validateBeforeSave: false });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};
