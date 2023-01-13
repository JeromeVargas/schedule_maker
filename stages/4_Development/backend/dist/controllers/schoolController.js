"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchool = exports.updateSchool = exports.createSchool = exports.getSchool = exports.getSchools = void 0;
const http_status_codes_1 = require("http-status-codes");
const bad_request_1 = __importDefault(require("../errors/bad-request"));
const schoolService_1 = require("../services/schoolService");
const getSchools = (req, res) => {
    res.json({ data: "testing the get schools endpoint" });
};
exports.getSchools = getSchools;
const getSchool = (req, res) => {
    res.send({ data: "testing the get a school endpoint" });
};
exports.getSchool = getSchool;
const createSchool = async ({ body }, res) => {
    if (!body.name) {
        throw new bad_request_1.default("Please add a school name");
    }
    const schoolCreated = await (0, schoolService_1.insertSchool)(body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json(schoolCreated);
};
exports.createSchool = createSchool;
const updateSchool = (req, res) => {
    res.send({ data: "testing the update school endpoint" });
};
exports.updateSchool = updateSchool;
const deleteSchool = (req, res) => {
    res.send({ data: "testing the delete school endpoint" });
};
exports.deleteSchool = deleteSchool;
