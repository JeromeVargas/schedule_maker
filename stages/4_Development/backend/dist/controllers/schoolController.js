"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchool = exports.updateSchool = exports.createSchool = exports.getSchool = exports.getSchools = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoServices_1 = require("../services/mongoServices");
const createSchool = async ({ body }, res) => {
    const schoolCreated = await (0, mongoServices_1.insertResource)(body, "school");
    res.status(http_status_codes_1.StatusCodes.CREATED).json(schoolCreated);
};
exports.createSchool = createSchool;
const getSchools = async (req, res) => {
    const schoolsFound = await (0, mongoServices_1.findAllResources)("school");
    res.status(http_status_codes_1.StatusCodes.OK).json(schoolsFound);
};
exports.getSchools = getSchools;
const getSchool = async ({ params }, res) => {
    const { id } = params;
    const schoolFound = await (0, mongoServices_1.findResourceById)(id, "school");
    res.status(http_status_codes_1.StatusCodes.OK).json(schoolFound);
};
exports.getSchool = getSchool;
const updateSchool = async ({ body, params }, res) => {
    const { id } = params;
    const schoolUpdated = await (0, mongoServices_1.updateResource)(id, body, "school");
    return res.status(http_status_codes_1.StatusCodes.OK).json(schoolUpdated);
};
exports.updateSchool = updateSchool;
const deleteSchool = async ({ params }, res) => {
    const { id } = params;
    const schoolDeleted = await (0, mongoServices_1.deleteResource)(id, "school");
    res.status(http_status_codes_1.StatusCodes.OK).json({ schoolDeleted, id });
};
exports.deleteSchool = deleteSchool;
