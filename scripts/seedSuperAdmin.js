import "dotenv/config";
import mongoose from "mongoose";
import SuperAdmin from "../src/models/superAdmin.model.js";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    if (!email || !password) {
      console.error("❌ EMAIL or PASSWORD not found in .env");
      process.exit(1);
    }

    // Check if super admin already exists
    const existing = await SuperAdmin.findOne({ email });
    if (existing) {
      console.log(`ℹ️  Super admin already exists: ${email}`);
      process.exit(0);
    }

    // Create super admin (password hashed by pre-save hook)
    const superAdmin = new SuperAdmin({ email, password });
    await superAdmin.save();

    console.log(`✅ Super admin seeded successfully`);
    console.log(`   Email   : ${email}`);
    console.log(`   Password: ${password} (stored hashed)`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
