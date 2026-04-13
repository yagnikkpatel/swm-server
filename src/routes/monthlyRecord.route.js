import express from "express";
import {
  createMonthlyTable,
  getMonthlyRecords,
  updateDailyLog,
} from "../controllers/monthlyRecord.controller.js";
import authSuperAdminOrAdmin from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-table", authSuperAdminOrAdmin, createMonthlyTable);
router.get("/", authSuperAdminOrAdmin, getMonthlyRecords);
router.patch("/update-day", authSuperAdminOrAdmin, updateDailyLog);

export default router;
