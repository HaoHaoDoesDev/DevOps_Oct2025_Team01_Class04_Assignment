import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; 
import { db } from "../config/db.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  console.log("🌱 Seeding Database...");

  try {
    const schemaPath = path.join(__dirname, "../../../db-init/01-schema.sql"); 
    const seedPath = path.join(__dirname, "../../../db-init/02-seed.sql");

    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    const seedSql = fs.readFileSync(seedPath, "utf8");

    await db.query(schemaSql);
    console.log("Schema applied");

    await db.query(seedSql);
    console.log("Data seeded");

    process.exit(0);
  } catch (err) {
    console.error("Seeding Failed:", err);
    process.exit(1);
  }
}

runSeed();