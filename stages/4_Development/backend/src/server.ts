// main and library imports
import "dotenv/config";
import express from "express";
import "express-async-errors";
import cors from "cors";

// local imports
import errorHandlerMiddleware from "./middleware/error-handler";
import notFound404Middleware from "./middleware/not-found";

// routes
import { router } from "./lib/router";

// server instantiation
export const server = express();

// db connection function import
import connectDB from "./config/connect";

// third-party middleware instantiation
server.use(cors());
server.use(express.json());

// local middleware instantiation
server.use(router);

// custom middleware
server.use(notFound404Middleware);
server.use(errorHandlerMiddleware);

// port to listen to
const PORT = process.env.PORT || 3001;

// db connection function execution
if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => console.log("Database connection established"));
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
