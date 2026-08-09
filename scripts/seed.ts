import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { spawn } from "child_process";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { dbConnect } from "../lib/db";
import { Movie } from "../models/Movie";
import { User } from "../models/User";

// Load environment variables
config({ path: path.join(process.cwd(), ".env.local") });

const SEED_LIMIT = 100; // Limit to 100 movies to avoid very long seed time

interface MovieData {
  title: string;
  budget: number;
  runtime: number;
  genre: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
}

interface PredictionResult {
  prediction: string;
  success_probability: number;
  status: string;
  message?: string;
}

// Parse genres from JSON string
function extractGenre(genresStr: string): string {
  try {
    const genres = JSON.parse(genresStr);
    if (Array.isArray(genres) && genres.length > 0) {
      return genres[0].name;
    }
  } catch {
    // ignore
  }
  return "Unknown";
}

// Determine python executable
function getPythonCommand(): string {
  const venvPython = path.join(process.cwd(), "venv", "Scripts", "python.exe");
  if (process.platform === "win32" && fs.existsSync(venvPython)) {
    return venvPython;
  }
  return process.platform === "win32" ? "python" : "python3";
}

// Call Python prediction service
async function predictMovie(movieData: MovieData): Promise<PredictionResult> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), "api", "ai", "predict.py");
    const pythonCommand = getPythonCommand();

    const python = spawn(pythonCommand, [pythonScript], {
      timeout: 30000,
    });

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data: Buffer) => {
      output += data.toString();
    });

    python.stderr.on("data", (data: Buffer) => {
      errorOutput += data.toString();
    });

    // Write input BEFORE listening to close
    python.stdin.write(JSON.stringify(movieData));
    python.stdin.end();

    python.on("close", (code: number) => {
      if (code !== 0 && !output) {
        reject(new Error(`Python process failed with code ${code}: ${errorOutput.slice(0, 200)}`));
        return;
      }

      try {
        const result = JSON.parse(output.trim());
        resolve(result);
      } catch {
        reject(new Error("Failed to parse Python output"));
      }
    });

    python.on("error", (error: Error) => {
      reject(error);
    });
  });
}

async function ensureUser(
  email: string,
  password: string,
  name: string,
  role: "admin" | "user" = "user"
) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      role,
    });
    console.log(`✅ Created user: ${email}`);
  } else {
    console.log(`ℹ️  User already exists: ${email}`);
  }
}

async function seedDatabase() {
  console.log("🌱 Starting database seeding...\n");

  // Connect to database
  await dbConnect();

  // ─── Create / ensure all users ───────────────────────────────────────────
  console.log("─── Users ──────────────────────────────────────────────────");
  await ensureUser("admin@lumina.ai", "Admin@1234", "Lumina Admin", "admin");
  await ensureUser("basit@lumina.ai", "theWhiteWolf", "Basit");
  await ensureUser("hadiya@lumina.ai", "pindiKiBadmash", "Hadiya");
  console.log("");

  // ─── Seed Movies ─────────────────────────────────────────────────────────
  const csvPath = path.join(process.cwd(), "TMDB", "tmdb_5000_movies.csv");

  if (!fs.existsSync(csvPath)) {
    console.warn("⚠️  TMDB CSV not found, skipping movie seeding.");
    console.log("\n✅ Seeding complete (users only).");
    process.exit(0);
  }

  const movies: MovieData[] = [];

  console.log("─── Reading CSV ─────────────────────────────────────────────");
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        if (movies.length >= SEED_LIMIT) return; // Early exit once we have enough

        const budget = parseFloat(row.budget);
        const runtime = parseFloat(row.runtime);
        const popularity = parseFloat(row.popularity);
        const vote_average = parseFloat(row.vote_average);
        const vote_count = parseInt(row.vote_count);

        if (
          !isNaN(budget) && budget > 0 &&
          !isNaN(runtime) && runtime > 0 &&
          !isNaN(popularity) && popularity >= 0 &&
          !isNaN(vote_average) && vote_average >= 0 && vote_average <= 10 &&
          !isNaN(vote_count) && vote_count >= 0 &&
          row.title && row.genres
        ) {
          const genre = extractGenre(row.genres);
          if (genre !== "Unknown") {
            movies.push({ title: row.title, budget, runtime, genre, popularity, vote_average, vote_count });
          }
        }
      })
      .on("end", () => {
        console.log(`Parsed ${movies.length} valid movies from CSV (limit: ${SEED_LIMIT})\n`);
        resolve();
      })
      .on("error", reject);
  });

  // ─── Process movies in batches ────────────────────────────────────────────
  console.log("─── Predicting & Saving Movies ─────────────────────────────");
  const batchSize = 5;
  let processed = 0;
  let savedCount = 0;

  for (let i = 0; i < movies.length; i += batchSize) {
    const batch = movies.slice(i, i + batchSize);
    console.log(
      `Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(movies.length / batchSize)} ...`
    );

    await Promise.all(
      batch.map(async (movieData) => {
        try {
          // Skip if already exists
          const exists = await Movie.findOne({ title: movieData.title });
          if (exists) {
            console.log(`  ⏭  Skip (exists): ${movieData.title}`);
            return;
          }

          const prediction = await predictMovie(movieData);

          if (prediction.status !== "success") {
            console.error(`  ✗  Prediction failed for "${movieData.title}": ${prediction.message}`);
            return;
          }

          await Movie.create({
            title: movieData.title,
            budget: movieData.budget,
            runtime: movieData.runtime,
            genre: movieData.genre,
            popularity: movieData.popularity,
            vote_average: movieData.vote_average,
            vote_count: movieData.vote_count,
            cast_size: 0,
            crew_size: 0,
            shooting_days: 0,
            locations_count: 0,
            director_experience: 0,
            actor_popularity: 0,
            prediction: prediction.prediction,
            success_probability: prediction.success_probability,
          });

          savedCount++;
          console.log(
            `  ✅ Saved: ${movieData.title} → ${prediction.prediction} (${prediction.success_probability}%)`
          );
        } catch (error) {
          console.error(`  ✗  Error processing "${movieData.title}":`, (error as Error).message);
        }
      })
    );

    processed += batch.length;
    console.log(`   Progress: ${processed}/${movies.length} | Saved: ${savedCount}\n`);

    // Small delay between batches
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n🎬 Seeding complete! Saved ${savedCount} movies to database.`);
}

// Run the seed script
seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });