/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

// Ensure the global mongoose cache exists
(global as any).mongoose = (global as any).mongoose || {
  conn: null,
  promise: null,
};

export default async function dbConnect() {
  if ((global as any).mongoose.conn) {
    return (global as any).mongoose.conn;
  }

  if (!(global as any).mongoose.promise && MONGO_URI != null) {
    (global as any).mongoose.promise = mongoose
      .connect(MONGO_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  (global as any).mongoose.conn = await (global as any).mongoose.promise;
  return (global as any).mongoose.conn;
}
