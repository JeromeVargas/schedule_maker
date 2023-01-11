import "dotenv/config";
import express from "express";
import cors from "cors";

const server = express();
server.use(cors());

const PORT = process.env.PORT || 3001;

// ------------------------------------------ --> continue here --> --------------------------------------

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
