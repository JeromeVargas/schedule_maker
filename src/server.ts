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
import mongoose from "mongoose";

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

// graceful shutdown
const signals = ["SIGINT", "SIGTERM", "SIGHUP"] as const;

const gracefulShutdown = async ({
  signal,
  connection,
}: {
  signal: (typeof signals)[number];
  connection: ReturnType<typeof createConnection>;
}) => {
  console.log(`Got signal ${signal}. Good bye`);
  connection.close();
  await mongoose.connection.close();
  console.log("Database connection closed");
  process.exit(0);
};

for (let i = 0; i < signals.length; i++) {
  process.on(signals[i], () =>
    gracefulShutdown({
      signal: signals[i],
      connection,
    })
  );
}
