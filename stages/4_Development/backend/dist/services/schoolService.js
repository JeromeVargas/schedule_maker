"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertSchool = void 0;
const schoolModel_1 = __importDefault(require("../models/schoolModel"));
const insertSchool = (school) => {
    const responseInsert = schoolModel_1.default.create(school);
    return responseInsert;
};
exports.insertSchool = insertSchool;
