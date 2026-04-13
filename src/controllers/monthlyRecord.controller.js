import MonthlyRecord from "../models/monthlyRecord.model.js";
import Customer from "../models/customer.model.js";

const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

// ─── Create Monthly Records (Bulk) ──────────────────────────────────────────
export const createMonthlyTable = async (req, res) => {
  try {
    const { month, year, customerIds } = req.body;

    if (!month || !year || !customerIds || !Array.isArray(customerIds)) {
      return res.status(400).json({
        success: false,
        message: "Month, year and an array of customer IDs are required",
      });
    }

    const daysInMonth = getDaysInMonth(year, month);
    const results = [];
    const errors = [];

    for (const customerId of customerIds) {
      try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
          errors.push({ customerId, message: "Customer not found" });
          continue;
        }

        // Initialize daily logs with 0
        const dailyLogs = [];
        for (let day = 1; day <= daysInMonth; day++) {
          dailyLogs.push({ day, jugCount: 0, total: 0 });
        }

        const record = new MonthlyRecord({
          customer: customerId,
          month,
          year,
          pricePerJug: customer.pricePerJug,
          dailyLogs,
          totalMonthlyJugs: 0,
          totalMonthlyAmount: 0,
        });

        await record.save();
        results.push(record);
      } catch (err) {
        if (err.code === 11000) {
          errors.push({ customerId, message: "Record already exists for this month" });
        } else {
          errors.push({ customerId, message: err.message });
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: `${results.length} records created. ${errors.length} skipped.`,
      records: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Monthly Records ────────────────────────────────────────────────────
export const getMonthlyRecords = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ success: false, message: "Month and year are required" });
    }

    const records = await MonthlyRecord.find({ month: Number(month), year: Number(year) })
      .populate("customer", "name pricePerJug")
      .sort({ "customer.name": 1 });

    return res.status(200).json({ success: true, count: records.length, records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Daily Jug Count ─────────────────────────────────────────────────
export const updateDailyLog = async (req, res) => {
  try {
    const { recordId, day, jugCount } = req.body;

    if (!recordId || day === undefined || jugCount === undefined) {
      return res.status(400).json({ success: false, message: "RecordId, day and jugCount are required" });
    }

    const record = await MonthlyRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const logEntry = record.dailyLogs.find((log) => log.day === Number(day));
    if (!logEntry) {
      return res.status(400).json({ success: false, message: "Invalid day for this month" });
    }

    // Update jug count and total for that day
    logEntry.jugCount = Number(jugCount);
    logEntry.total = logEntry.jugCount * record.pricePerJug;

    // Recalculate monthly totals
    record.totalMonthlyJugs = record.dailyLogs.reduce((acc, log) => acc + log.jugCount, 0);
    record.totalMonthlyAmount = record.dailyLogs.reduce((acc, log) => acc + log.total, 0);

    await record.save();

    return res.status(200).json({
      success: true,
      message: `Day ${day} updated successfully`,
      record,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
