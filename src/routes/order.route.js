import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByCustomer,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";
import authSuperAdminOrAdmin from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authSuperAdminOrAdmin, createOrder);
router.get("/", authSuperAdminOrAdmin, getAllOrders);
router.get("/customer/:customerId", authSuperAdminOrAdmin, getOrdersByCustomer);
router.get("/:id", authSuperAdminOrAdmin, getOrderById);
router.put("/:id", authSuperAdminOrAdmin, updateOrder);
router.delete("/:id", authSuperAdminOrAdmin, deleteOrder);

export default router;
