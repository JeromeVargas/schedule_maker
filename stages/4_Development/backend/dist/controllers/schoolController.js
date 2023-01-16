"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchool = exports.updateSchool = exports.createSchool = exports.getSchool = exports.getSchools = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoServices_1 = require("../services/mongoServices");
const getSchools = (req, res) => {
    res.json({ data: "testing the get schools endpoint" });
};
exports.getSchools = getSchools;
const getSchool = (req, res) => {
    res.json({ data: "testing the get a school endpoint" });
};
exports.getSchool = getSchool;
const createSchool = async ({ body }, res) => {
    const schoolCreated = await (0, mongoServices_1.insertResource)(body, "school");
    res.status(http_status_codes_1.StatusCodes.CREATED).json(schoolCreated);
};
exports.createSchool = createSchool;
const updateSchool = (req, res) => {
    res.json({ data: "testing the update school endpoint" });
};
exports.updateSchool = updateSchool;
const deleteSchool = (req, res) => {
    res.json({ data: "testing the delete school endpoint" });
};
exports.deleteSchool = deleteSchool;
