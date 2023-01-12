import mongoose from "mongoose";

const connectDB = async (url: string | undefined) => {
  try {
    if (url) {
      await mongoose.connect(url);
    }
  } catch (error) {
    console.log(error);
  }
};

export { connectDB };
