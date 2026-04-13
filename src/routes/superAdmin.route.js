import express from "express";
import {
  superAdminLogin,
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/superAdmin.controller.js";
import authSuperAdmin from "../middlewares/authSuperAdmin.js";

const router = express.Router();

router.post("/login", superAdminLogin);
router.post("/admins", authSuperAdmin, createAdmin);
router.get("/admins", authSuperAdmin, getAllAdmins);
router.get("/admins/:id", authSuperAdmin, getAdminById);
router.put("/admins/:id", authSuperAdmin, updateAdmin);
router.delete("/admins/:id", authSuperAdmin, deleteAdmin);

export default router;
