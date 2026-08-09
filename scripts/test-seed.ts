import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { dbConnect } from "../lib/db";
import { Actor } from "../models/Actor";

config({ path: path.join(process.cwd(), ".env.local") });

async function testSeed() {
  console.log("🌱 Testing minimal seed...");
  await dbConnect();
  await Actor.deleteMany({ name: "Test Actor" });
  try {
    const a = await Actor.create({
      name: "Test Actor",
      genres: ["Action"],
      matchPercent: 95
    });
    console.log("✅ Minimal seed success:", a.name);
  } catch (err: unknown) {
    const error = err as { message?: string; errors?: Record<string, { message: string }> };
    console.error("❌ Minimal seed failure:", error.message);
    if (error.errors) {
        Object.keys(error.errors).forEach(k => console.log(`${k}: ${error.errors![k].message}`));
    }
  }
  process.exit(0);
}

testSeed().catch(console.error);
