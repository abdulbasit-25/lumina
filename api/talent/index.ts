import { VercelRequest, VercelResponse } from "@vercel/node";
import { dbConnect } from "../../lib/db";
import { Actor } from "../../models/Actor";
import { TeamMember } from "../../models/TeamMember";
import { User } from "../../models/User";
import { verifyAuth } from "../../utils/auth";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  await dbConnect();
  const auth = verifyAuth(req);

  try {
    if (req.method === "GET") {
      const { type } = req.query;
      if (type === "cast") {
        const talent = await Actor.find().populate("createdBy", "name").lean();
        return res.status(200).json({ success: true, data: talent });
      } else if (type === "crew") {
        const talent = await TeamMember.find().populate("createdBy", "name").lean();
        return res.status(200).json({ success: true, data: talent });
      } else {
        return res.status(400).json({ error: "Invalid type" });
      }
    }

    if (req.method === "POST") {
      if (!auth) return res.status(401).json({ error: "Unauthorized" });
      const { type, name, genres, role, experience, rating, projects, popularity, available } = req.body;
      
      if (type === "cast") {
        const actor = await Actor.create({ name, genres, role, projects, rating, popularity, available, createdBy: auth.userId });
        return res.status(201).json({ success: true, data: actor });
      } else if (type === "crew") {
        const crew = await TeamMember.create({ name, role, experience, rating, projects, createdBy: auth.userId });
        return res.status(201).json({ success: true, data: crew });
      }
    }

    if (req.method === "PATCH") {
      if (!auth) return res.status(401).json({ error: "Unauthorized" });
      const { type, id, status } = req.body;
      if (type === "cast") {
        const actor = await Actor.findByIdAndUpdate(id, { status }, { new: true });
        return res.status(200).json({ success: true, data: actor });
      } else if (type === "crew") {
        const crew = await TeamMember.findByIdAndUpdate(id, { status }, { new: true });
        return res.status(200).json({ success: true, data: crew });
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
