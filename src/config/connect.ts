import mongoose from "mongoose";

export default async function connectDB(): Promise<void> {
  const DB_URI = <string>process.env.MONGO_URI;
  await mongoose.connect(DB_URI);
}
