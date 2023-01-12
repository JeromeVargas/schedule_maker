"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", false);
async function connectDB() {
    const DB_URI = process.env.MONGO_URI;
    await mongoose_1.default.connect(DB_URI);
}
exports.default = connectDB;
