import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || "portfolio";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
