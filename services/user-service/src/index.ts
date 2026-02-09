import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { db } from "./config/db.js";
import fileRoutes from "./routes/fileRoute.js";

const app = express();
const PORT = process.env.PORT || 5002; 
const fileRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use(cors());
app.use(express.json());

app.use("/api/files", fileRateLimiter, fileRoutes);

const start = async () => {
  try {
    await db.query("SELECT NOW()");
    console.log("User Service: Database connected");

    app.listen(PORT, () => {
      console.log(`User Service ready at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("User Service Shutdown: Database connection failed", err);
    process.exit(1);
  }
};

start();