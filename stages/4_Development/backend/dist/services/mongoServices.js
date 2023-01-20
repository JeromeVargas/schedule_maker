"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.updateResource = exports.findResourceByProperty = exports.findResourceById = exports.findAllResources = exports.insertResource = exports.isValidId = void 0;
const mongoose_1 = require("mongoose");
const schoolModel_1 = __importDefault(require("../models/schoolModel"));
const models = {
    school: schoolModel_1.default,
};
const isValidId = (id) => {
    return (0, mongoose_1.isValidObjectId)(id);
};
exports.isValidId = isValidId;
const insertResource = (resource, resourceName) => {
    const model = models[resourceName];
    const resourceInsert = model.create(resource);
    return resourceInsert;
};
exports.insertResource = insertResource;
const findAllResources = (resourceName) => {
    const model = models[resourceName];
    const resourceFound = model.find().lean().exec();
    return resourceFound;
};
exports.findAllResources = findAllResources;
const findResourceById = (resourceId, resourceName) => {
    const model = models[resourceName];
    const resourceFound = model.findById(resourceId).lean().exec();
    return resourceFound;
};
exports.findResourceById = findResourceById;
const findResourceByProperty = (resource, resourceName) => {
    const model = models[resourceName];
    const resourceFound = model
        .findOne(resource)
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    return resourceFound;
};
exports.findResourceByProperty = findResourceByProperty;
const updateResource = (resourceId, resource, resourceName) => {
    const model = models[resourceName];
    const resourceUpdated = model.findByIdAndUpdate(resourceId, resource, {
        new: true,
        runValidators: true,
    });
    return resourceUpdated;
};
exports.updateResource = updateResource;
const deleteResource = (resourceId, resourceName) => {
    const model = models[resourceName];
    const resourceDeleted = model
        .findOneAndRemove({ _id: resourceId })
        .lean()
        .exec();
    return resourceDeleted;
};
exports.deleteResource = deleteResource;
