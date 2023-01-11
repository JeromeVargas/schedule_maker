"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
const PORT = process.env.PORT || 3001;
// ------------------------------------------ --> continue here --> --------------------------------------
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
