import mongoose from "mongoose";

mongoose.set("strictQuery", false);

async function connectDB(): Promise<void> {
  const DB_URI = <string>process.env.MONGO_URI;
  await mongoose.connect(DB_URI);
}

export default connectDB;
