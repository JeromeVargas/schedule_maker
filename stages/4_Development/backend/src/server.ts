import "dotenv/config";
import express from "express";
import cors from "cors";
const PORT = process.env.PORT || 3001;

import { router } from "./routes";

export const server = express();
server.use(cors());
server.use(express.json());

server.use(router);

server.use(cors());

// ------------------------------------------ --> continue here --> --------------------------------------
export const connection =
  process.env.NODE_ENV === "test"
    ? server.listen(process.env.PORT_TEST)
    : server.listen(PORT, () =>
        console.log(`Server listening on port ${PORT}`)
      );
