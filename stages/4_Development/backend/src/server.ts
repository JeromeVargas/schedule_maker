// main and library imports
import "dotenv/config";
import express from "express";

import cors from "cors";
const PORT = process.env.PORT || 3001;

// routes
import { router } from "./routes";

// server instantiation
export const server = express();

// db connection function import
import { connectDB } from "./config/connect";

// third-party middleware instantiation
server.use(cors());
server.use(express.json());

server.use(router);

server.use(cors());

// db connection function execution
if (process.env.NODE_ENV !== "test") {
  connectDB(process.env.MONGO_URI_DEV);
  console.log("Data base connection established");
}

// connection instantiation
export const connection =
  process.env.NODE_ENV === "test"
    ? server.listen(process.env.PORT_TEST)
    : server.listen(PORT, () =>
        console.log(`Server listening on port ${PORT}`)
      );

// ------------------------------------------ --> continue here --> --------------------------------------
