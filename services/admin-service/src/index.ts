import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from "./config/db.js";
import authRoutes from "./routes/auth-routes.js";
import { authorizeAdmin } from "./middleware/role-middleware.js";
import * as UserModel from "./models/User.js";
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});


const app = express();
const PORT = process.env.PORT || 5001;

app.use(limiter);
app.use(cors());
app.use(express.json());

// Public Route
app.use("/auth", authRoutes);

// Protected Admin Route (Example: Get all users)
app.get("/users", authorizeAdmin, async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

const start = async () => {
  try {
    await db.query("SELECT NOW()");
    console.log("✅ Admin Service: Database connected");
    app.listen(PORT, () => {
      console.log(`Admin Service listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start Admin Service", err);
    process.exit(1);
  }
};

start();