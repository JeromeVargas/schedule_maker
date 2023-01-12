// main and library imports
import "dotenv/config";
import express from "express";
import cors from "cors";

// port to listen to
const PORT = process.env.PORT || 3001;

// routes
import { router } from "./routes";

// server instantiation
export const server = express();

// db connection function import
import connectDB from "./config/connect";

// third-party middleware instantiation
server.use(cors());
server.use(express.json());

server.use(router);

server.use(cors());

// db connection function execution
if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => console.log("Data base connection established"));
}

const createConnection = () => {
  if (process.env.NODE_ENV === "test") {
    return server.listen(process.env.PORT_TEST);
  } else {
    return server.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`)
    );
  }
};

//server instantiation
export const connection = createConnection();
