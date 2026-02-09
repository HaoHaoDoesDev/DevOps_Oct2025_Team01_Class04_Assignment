import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from "./config/db.js";
import fileRoutes from "./routes/fileRoute.js";

const app = express();
const PORT = process.env.PORT || 5002; 

app.use(cors());
app.use(express.json());

app.use("/api/files", fileRoutes);

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