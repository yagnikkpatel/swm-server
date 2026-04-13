import mongoose from "mongoose";

const dailyLogSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  jugCount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
});

const monthlyRecordSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    month: {
      type: Number, // 1-12
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    pricePerJug: {
      type: Number,
      required: true,
    },
    dailyLogs: [dailyLogSchema],
    totalMonthlyJugs: {
      type: Number,
      default: 0,
    },
    totalMonthlyAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Unique index to prevent duplicate records for the same month/customer
monthlyRecordSchema.index({ customer: 1, month: 1, year: 1 }, { unique: true });

const MonthlyRecord = mongoose.model("MonthlyRecord", monthlyRecordSchema);
export default MonthlyRecord;
