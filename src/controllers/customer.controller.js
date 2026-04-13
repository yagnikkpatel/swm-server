import Customer from "../models/customer.model.js";

// ─── Create Customer ────────────────────────────────────────────────────────
export const createCustomer = async (req, res) => {
  try {
    const { name, contact, whatsappNumber, addresses, pricePerJug } = req.body;

    if (!name || !contact || !pricePerJug) {
      return res.status(400).json({ success: false, message: "Name, contact and price per jug are required" });
    }

    // Ensure only one address is active if multiple are provided
    if (addresses && addresses.length > 0) {
      const activeAddresses = addresses.filter((addr) => addr.isActive);
      if (activeAddresses.length > 1) {
        return res.status(400).json({ success: false, message: "Only one address can be active at a time" });
      }
      // If none are active, set the first one as active by default
      if (activeAddresses.length === 0) {
        addresses[0].isActive = true;
      }
    }

    const customer = new Customer({
      name,
      contact,
      whatsappNumber,
      addresses,
      pricePerJug,
    });

    await customer.save();

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Customers ──────────────────────────────────────────────────────
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Customer By ID ─────────────────────────────────────────────────────
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    return res.status(200).json({ success: true, customer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Customer ────────────────────────────────────────────────────────
export const updateCustomer = async (req, res) => {
  try {
    const { name, contact, whatsappNumber, addresses, pricePerJug } = req.body;

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    if (name) customer.name = name;
    if (contact) customer.contact = contact;
    if (whatsappNumber) customer.whatsappNumber = whatsappNumber;
    if (pricePerJug !== undefined) customer.pricePerJug = pricePerJug;

    if (addresses) {
      const activeAddresses = addresses.filter((addr) => addr.isActive);
      if (activeAddresses.length > 1) {
        return res.status(400).json({ success: false, message: "Only one address can be active at a time" });
      }
      customer.addresses = addresses;
    }

    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Customer ────────────────────────────────────────────────────────
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    return res.status(200).json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
