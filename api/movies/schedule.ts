import { VercelRequest, VercelResponse } from "@vercel/node";
import { dbConnect } from "../../lib/db";
import { ScheduledEvent } from "../../models/ScheduledEvent";
import { verifyAuth, sendUnauthorized } from "../../utils/auth";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const user = verifyAuth(req);
  if (!user) return sendUnauthorized(res);

  await dbConnect();

  if (req.method === "GET") {
    try {
      const events = await ScheduledEvent.find().sort({ date: 1 }).lean();
      return res.status(200).json({ success: true, data: events });
    } catch (error) {
      console.error("Get schedule events error:", error);
      return res.status(500).json({ error: "Failed to fetch schedule events" });
    }
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { movieTitle, date, type, description } = req.body;

    if (!movieTitle || !date || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const event = await ScheduledEvent.create({
      movieTitle,
      date: new Date(date),
      type,
      description,
      status: "Scheduled"
    });

    return res.status(201).json({
      success: true,
      message: "Event scheduled successfully",
      data: event
    });
  } catch (error) {
    console.error("Schedule event error:", error);
    return res.status(500).json({
      error: "Failed to schedule event",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
