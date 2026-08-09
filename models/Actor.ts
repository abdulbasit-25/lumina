import mongoose, { Schema, Document } from "mongoose";

export interface IActor extends Document {
  name: string;
  genres: string[];
  role?: string;
  projects?: number;
  rating?: number;
  popularity?: number;
  available?: boolean;
  image?: string;
  matchPercent?: number; // Optional: match percent for specific genre
  status: "active" | "blocked";
  createdBy?: mongoose.Types.ObjectId;
}

const ActorSchema = new Schema<IActor>(
  {
    name: { type: String, required: true, trim: true },
    genres: [{ type: String, required: true }],
    role: { type: String },
    projects: { type: Number },
    rating: { type: Number },
    popularity: { type: Number },
    available: { type: Boolean, default: true },
    image: { type: String },
    matchPercent: { type: Number },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Actor = mongoose.models.Actor || mongoose.model<IActor>("Actor", ActorSchema);
