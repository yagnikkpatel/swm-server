import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";
import authSuperAdminOrAdmin from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authSuperAdminOrAdmin, createCustomer);
router.get("/", authSuperAdminOrAdmin, getAllCustomers);
router.get("/:id", authSuperAdminOrAdmin, getCustomerById);
router.put("/:id", authSuperAdminOrAdmin, updateCustomer);
router.delete("/:id", authSuperAdminOrAdmin, deleteCustomer);

export default router;
