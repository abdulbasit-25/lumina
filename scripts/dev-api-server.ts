/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "dotenv";
import path from "path";
import express from "express";

// Load environment variables FIRST before any handler imports
config({ path: path.join(process.cwd(), ".env.local") });

import loginHandler from "../api/auth/login";
import registerHandler from "../api/auth/register";
import moviesHandler from "../api/movies/index";
import predictHandler from "../api/predict";
import talentHandler from "../api/talent/index";
import scheduleHandler from "../api/movies/schedule";

const app = express();
const port = 8085;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Global CORS middleware for all dev API requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.post("/api/auth/login", async (req, res) => {
  try {
    await loginHandler(req as any, res as any);
  } catch (error) {
    console.error("/api/auth/login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    await registerHandler(req as any, res as any);
  } catch (error) {
    console.error("/api/auth/register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.all("/api/movies", async (req, res) => {
  try {
    await moviesHandler(req as any, res as any);
  } catch (error) {
    console.error("/api/movies error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.all("/api/movies/:id", async (req, res) => {
  try {
    await moviesHandler(req as any, res as any);
  } catch (error) {
    console.error("/api/movies/:id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/predict", async (req, res) => {
  try {
    await predictHandler(req as any, res as any);
  } catch (error) {
    console.error("/api/predict error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.all("/api/talent", async (req, res) => {
  try {
    await talentHandler(req as any, res as any);
  } catch (error) {
    console.error("/api/talent error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.all("/api/movies/schedule", async (req, res) => {
  try {
    await scheduleHandler(req as any, res as any);
  } catch (error) {
    console.error("/api/movies/schedule error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`✅ Dev API server running on http://localhost:${port}`);
  console.log(`   MONGO_URI: ${process.env.MONGO_URI ? "✓ loaded" : "✗ MISSING"}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? "✓ loaded" : "✗ MISSING"}`);
});
