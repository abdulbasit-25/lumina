import mongoose, { Schema, Document } from "mongoose";

export interface IScheduledEvent extends Document {
  movieTitle: string;
  date: Date;
  type: "Production" | "Marketing" | "Release" | "Screening";
  description: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  createdBy?: mongoose.Types.ObjectId;
}

const ScheduledEventSchema = new Schema<IScheduledEvent>(
  {
    movieTitle: { type: String, required: true },
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: ["Production", "Marketing", "Release", "Screening"],
      required: true,
    },
    description: { type: String },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const ScheduledEvent = mongoose.models.ScheduledEvent || mongoose.model<IScheduledEvent>("ScheduledEvent", ScheduledEventSchema);
