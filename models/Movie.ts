import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  budget: number;
  runtime: number;
  genre: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  cast_size: number;
  crew_size: number;
  shooting_days: number;
  locations_count: number;
  director_experience: number;
  actor_popularity: number;
  poster_url: string;
  prediction: string;
  success_probability: number;
  suggestedActors?: string[];
  suggestedDirector?: string;
  status: 'Pre-Production' | 'In Production' | 'Post-Production' | 'Completed';
  spent: number;
  progress: number;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    runtime: {
      type: Number,
      required: true,
      min: 0,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    popularity: {
      type: Number,
      required: true,
      min: 0,
    },
    vote_average: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    vote_count: {
      type: Number,
      required: true,
      min: 0,
    },
    cast_size: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    crew_size: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    shooting_days: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    locations_count: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    director_experience: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    actor_popularity: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    poster_url: {
      type: String,
      required: false,
      default: null,
    },
    prediction: {
      type: String,
      required: true,
      enum: ["Successful", "Not Successful"],
    },
    success_probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    suggestedActors: [{ type: String }],
    suggestedDirector: { type: String },
    status: { 
      type: String, 
      enum: ['Pre-Production', 'In Production', 'Post-Production', 'Completed'],
      default: 'Pre-Production'
    },
    spent: { type: Number, default: 0 },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const Movie =
  mongoose.models.Movie ||
  mongoose.model<IMovie>("Movie", MovieSchema);
