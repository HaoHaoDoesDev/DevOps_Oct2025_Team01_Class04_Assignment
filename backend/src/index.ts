import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import fileRoutes from "./routes/fileRoute.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

const start = async () => {
  try {
    // Check DB connection
    await db.query("SELECT NOW()");
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Shutdown: Database connection failed", err);
    process.exit(1);
  }
};

start();
