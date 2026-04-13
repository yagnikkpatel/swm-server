import jwt from "jsonwebtoken";
import SuperAdmin from "../models/superAdmin.model.js";

const authSuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const superAdmin = await SuperAdmin.findById(decoded.id).select("-password");
    if (!superAdmin || superAdmin.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Forbidden: Super admin access only" });
    }

    req.superAdmin = superAdmin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};

export default authSuperAdmin;
