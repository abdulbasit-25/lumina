// Define the shape of our cached mongoose connection
interface MongooseCache {
  conn: typeof import('mongoose') | null;
  promise: Promise<typeof import('mongoose')> | null;
}

// Ensure the global object has the mongoose property
declare global {
  var mongoose: MongooseCache | undefined;
}

import mongoose from "mongoose";
import { config } from "dotenv";
import path from "path";

// Load environment variables
config({ path: path.join(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  // We know cached is defined at this point because of the initialization above
  const currentCache = cached!;

  if (currentCache.conn) {
    return currentCache.conn;
  }

  if (!currentCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    currentCache.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    currentCache.conn = await currentCache.promise;
  } catch (e) {
    currentCache.promise = null;
    throw e;
  }

  return currentCache.conn;
}
