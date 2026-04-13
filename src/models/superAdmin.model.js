import mongoose from "mongoose";
import passwordPlugin from "./plugins/password.plugin.js";

const superAdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "superadmin",
    },
  },
  { timestamps: true }
);

superAdminSchema.plugin(passwordPlugin);

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);
export default SuperAdmin;
