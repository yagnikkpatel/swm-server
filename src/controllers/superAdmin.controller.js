import jwt from "jsonwebtoken";
import SuperAdmin from "../models/superAdmin.model.js";
import Admin from "../models/admin.model.js";

// ─── Super Admin Login ────────────────────────────────────────────────────────
export const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await superAdmin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: superAdmin._id, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "10d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      superAdmin: {
        id: superAdmin._id,
        email: superAdmin.email,
        role: superAdmin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Create Admin ─────────────────────────────────────────────────────────────
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: "Admin with this email already exists" });
    }

    const admin = new Admin({ name, email, password });
    await admin.save();

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Admins ───────────────────────────────────────────────────────────
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Admin By ID ──────────────────────────────────────────────────────────
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    return res.status(200).json({ success: true, admin });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Admin ─────────────────────────────────────────────────────────────
export const updateAdmin = async (req, res) => {
  try {
    const { name, email, password, isActive } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) admin.password = password; // pre-save hook will re-hash
    if (typeof isActive === "boolean") admin.isActive = isActive;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Admin ─────────────────────────────────────────────────────────────
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    return res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
