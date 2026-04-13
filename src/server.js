import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import superAdminRoutes from "./routes/superAdmin.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3100;

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api", superAdminRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is connected on port http://localhost:${PORT}`);
  connectDB();
});