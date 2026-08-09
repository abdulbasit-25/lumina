import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  projects: number;
  rating: number;
  experience: string;
  status: "active" | "blocked";
  createdBy?: mongoose.Types.ObjectId;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    projects: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    experience: { type: String },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
