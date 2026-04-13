import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";

// ─── Create Order ───────────────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const {
      customerId,
      quantity,
      pricePerJug,
      deliveryDate,
      deliveryTime,
      isCustomDelivery,
      customDeliveryDetails,
    } = req.body;

    if (!customerId || !quantity || !deliveryDate || !deliveryTime) {
      return res.status(400).json({
        success: false,
        message: "Customer ID, quantity, delivery date and time are required",
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    // Use provided pricePerJug or fall back to customer's default
    const finalPricePerJug = pricePerJug !== undefined ? pricePerJug : customer.pricePerJug;

    const totalAmount = quantity * finalPricePerJug;

    const order = new Order({
      customer: customerId,
      quantity,
      pricePerJug: finalPricePerJug,
      totalAmount,
      deliveryDate,
      deliveryTime,
      isCustomDelivery: isCustomDelivery || false,
      customDeliveryDetails: isCustomDelivery ? customDeliveryDetails : {},
    });

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Orders ─────────────────────────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name contact addresses")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Orders By Customer ─────────────────────────────────────────────────
export const getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId })
      .populate("customer", "name contact addresses")
      .sort({ deliveryDate: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Order By ID ────────────────────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Order ───────────────────────────────────────────────────────────
export const updateOrder = async (req, res) => {
  try {
    const {
      quantity,
      pricePerJug,
      deliveryDate,
      deliveryTime,
      isCustomDelivery,
      customDeliveryDetails,
      status,
    } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (quantity !== undefined) order.quantity = quantity;
    if (pricePerJug !== undefined) order.pricePerJug = pricePerJug;

    // Recalculate total if quantity or price changed
    if (quantity !== undefined || pricePerJug !== undefined) {
      order.totalAmount = order.quantity * order.pricePerJug;
    }

    if (deliveryDate) order.deliveryDate = deliveryDate;
    if (deliveryTime) order.deliveryTime = deliveryTime;
    if (status) order.status = status;

    if (isCustomDelivery !== undefined) {
      order.isCustomDelivery = isCustomDelivery;
      if (isCustomDelivery && customDeliveryDetails) {
        order.customDeliveryDetails = customDeliveryDetails;
      } else if (!isCustomDelivery) {
        order.customDeliveryDetails = {};
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Order ───────────────────────────────────────────────────────────
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
