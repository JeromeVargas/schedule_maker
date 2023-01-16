"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertResource = void 0;
const schoolModel_1 = __importDefault(require("../models/schoolModel"));
const models = {
    school: schoolModel_1.default,
};
const insertResource = async (resource, resourceName) => {
    const model = models[resourceName];
    const resourceInsert = model.create(resource);
    return resourceInsert;
};
exports.insertResource = insertResource;
