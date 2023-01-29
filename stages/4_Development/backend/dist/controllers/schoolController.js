"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchool = exports.updateSchool = exports.createSchool = exports.getSchool = exports.getSchools = void 0;
const http_status_codes_1 = require("http-status-codes");
const bad_request_1 = __importDefault(require("../errors/bad-request"));
const conflict_1 = __importDefault(require("../errors/conflict"));
const not_found_1 = __importDefault(require("../errors/not-found"));
const mongoServices_1 = require("../services/mongoServices");
const createSchool = async ({ body }, res) => {
    const searchCriteria = { name: body.name };
    const fieldsToReturn = "-_id -createdAt -updatedAt";
    const model = "school";
    const duplicate = await (0, mongoServices_1.findResourceByProperty)(searchCriteria, fieldsToReturn, model);
    if (duplicate) {
        throw new conflict_1.default("This school name already exists");
    }
    const schoolCreated = await (0, mongoServices_1.insertResource)(body, model);
    if (!schoolCreated) {
        throw new bad_request_1.default("School not created");
    }
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "School created successfully!" });
};
exports.createSchool = createSchool;
const getSchools = async (req, res) => {
    const fieldsToReturn = "-createdAt -updatedAt";
    const model = "school";
    const schoolsFound = await (0, mongoServices_1.findAllResources)(fieldsToReturn, model);
    if (!schoolsFound || schoolsFound.length === 0) {
        throw new not_found_1.default("No schools found");
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(schoolsFound);
};
exports.getSchools = getSchools;
const getSchool = async ({ params }, res) => {
    const { id: schoolId } = params;
    const isValidSchoolId = (0, mongoServices_1.isValidId)(schoolId);
    if (isValidSchoolId === false) {
        throw new bad_request_1.default("Invalid school Id");
    }
    const fieldsToReturn = "-createdAt -updatedAt";
    const model = "school";
    const schoolFound = await (0, mongoServices_1.findResourceById)(schoolId, fieldsToReturn, model);
    if (!schoolFound) {
        throw new not_found_1.default("School not found");
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(schoolFound);
};
exports.getSchool = getSchool;
const updateSchool = async ({ body, params }, res) => {
    const { id: schoolId } = params;
    const isValidSchoolId = (0, mongoServices_1.isValidId)(schoolId);
    if (isValidSchoolId === false) {
        throw new bad_request_1.default("Invalid school Id");
    }
    const searchCriteria = { name: body.name };
    const fieldsToReturn = "-createdAt -updatedAt";
    const model = "school";
    const duplicate = await (0, mongoServices_1.findResourceByProperty)(searchCriteria, fieldsToReturn, model);
    if (duplicate && (duplicate === null || duplicate === void 0 ? void 0 : duplicate._id.toString()) !== schoolId) {
        throw new conflict_1.default("This school name already exists");
    }
    const schoolUpdated = await (0, mongoServices_1.updateResource)(schoolId, body, model);
    if (!schoolUpdated) {
        throw new not_found_1.default("School not updated");
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "School updated" });
};
exports.updateSchool = updateSchool;
const deleteSchool = async ({ params }, res) => {
    const { id: schoolId } = params;
    const isValidSchoolId = (0, mongoServices_1.isValidId)(schoolId);
    if (isValidSchoolId === false) {
        throw new bad_request_1.default("Invalid school Id");
    }
    const model = "school";
    const schoolDeleted = await (0, mongoServices_1.deleteResource)(schoolId, model);
    if (!schoolDeleted) {
        throw new not_found_1.default("School not deleted");
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "School deleted" });
};
exports.deleteSchool = deleteSchool;
