import path from "path";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { dbConnect } from "../lib/db";
import { User } from "../models/User";

config({ path: path.join(process.cwd(), ".env.local") });

async function ensureUser(
  email: string,
  password: string,
  name: string,
  role: "admin" | "user" = "user"
) {
  const existing = await User.findOne({ email });

  if (!existing) {
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    console.log(`✅ Created user: ${email}`);
  } else {
    console.log(`⏭ User already exists: ${email}`);
  }
}

async function seedUsers() {
  try {
    await dbConnect();

    console.log("─── Users ──────────────────────────────────────────────────");

    await ensureUser(
      "admin@lumina.ai",
      "Admin@1234",
      "Lumina Admin",
      "admin"
    );

    await ensureUser(
      "basit@lumina.ai",
      "theWhiteWolf",
      "Basit"
    );

    await ensureUser(
      "hadiya@lumina.ai",
      "Hadiya@1234",
      "Hadiya"
    );

    console.log("");
    console.log("🎉 User seeding completed");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed");
    console.error(err);

    process.exit(1);
  }
}

seedUsers();