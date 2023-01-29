"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const not_found_1 = __importDefault(require("../errors/not-found"));
const notFound404Middleware = (req, res) => {
    throw new not_found_1.default("Route does not exist");
};
exports.default = notFound404Middleware;
