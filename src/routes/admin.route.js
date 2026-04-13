import express from "express";
import { adminLogin } from "../controllers/admin.controller.js";

const router = express.Router();

// Admin Login Route
router.post("/login", adminLogin);

export default router;
