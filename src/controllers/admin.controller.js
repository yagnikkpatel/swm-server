import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

/**
 * Login for regular admins.
 * Returns a JWT token and admin details.
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // 2. Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // 3. Check if account is active
    if (!admin.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: "Your account has been deactivated. Please contact the Super Admin." 
      });
    }

    // 4. Compare password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // 5. Generate JWT Token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // 6. Success response
    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
