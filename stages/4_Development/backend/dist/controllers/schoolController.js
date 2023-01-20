"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchool = exports.updateSchool = exports.createSchool = exports.getSchool = exports.getSchools = void 0;
const http_status_codes_1 = require("http-status-codes");
const bad_request_1 = __importDefault(require("../errors/bad-request"));
const conflict_1 = __importDefault(require("../errors/conflict"));
const mongoServices_1 = require("../services/mongoServices");
const createSchool = async ({ body }, res) => {
    const duplicate = await (0, mongoServices_1.findResourceByProperty)(body, "school");
    if (duplicate) {
        throw new conflict_1.default("This school name already exists");
    }
    const schoolCreated = await (0, mongoServices_1.insertResource)(body, "school");
    if (schoolCreated) {
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(schoolCreated);
    }
    else {
        throw new bad_request_1.default("School not created");
    }
};
exports.createSchool = createSchool;
const getSchools = async (req, res) => {
    const schoolsFound = await (0, mongoServices_1.findAllResources)("school");
    res.status(http_status_codes_1.StatusCodes.OK).json(schoolsFound);
};
exports.getSchools = getSchools;
const getSchool = async ({ params }, res) => {
    const { id: schoolId } = params;
    const isValid = (0, mongoServices_1.isValidId)(schoolId);
    if (isValid === false) {
        throw new bad_request_1.default("Invalid Id");
    }
    const schoolFound = await (0, mongoServices_1.findResourceById)(schoolId, "school");
    res.status(http_status_codes_1.StatusCodes.OK).json(schoolFound);
};
exports.getSchool = getSchool;
const updateSchool = async ({ body, params }, res) => {
    const { id: schoolId } = params;
    const isValid = (0, mongoServices_1.isValidId)(schoolId);
    if (isValid === false) {
        throw new bad_request_1.default("Invalid Id");
    }
    const schoolUpdated = await (0, mongoServices_1.updateResource)(schoolId, body, "school");
    return res.status(http_status_codes_1.StatusCodes.OK).json(schoolUpdated);
};
exports.updateSchool = updateSchool;
const deleteSchool = async ({ params }, res) => {
    const { id: schoolId } = params;
    const isValid = (0, mongoServices_1.isValidId)(schoolId);
    if (isValid === false) {
        throw new bad_request_1.default("Invalid Id");
    }
    const schoolDeleted = await (0, mongoServices_1.deleteResource)(schoolId, "school");
    res.status(http_status_codes_1.StatusCodes.OK).json(schoolDeleted);
};
exports.deleteSchool = deleteSchool;
