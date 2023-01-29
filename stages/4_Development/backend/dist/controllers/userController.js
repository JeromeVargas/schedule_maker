"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const bad_request_1 = __importDefault(require("../errors/bad-request"));
const conflict_1 = __importDefault(require("../errors/conflict"));
const not_found_1 = __importDefault(require("../errors/not-found"));
const mongoServices_1 = require("../services/mongoServices");
const createUser = async ({ body }, res) => {
    const { school: schoolId } = body;
    const isValidSchoolId = (0, mongoServices_1.isValidId)(schoolId);
    if (isValidSchoolId === false) {
        throw new bad_request_1.default("Invalid school Id");
    }
    const searchCriteria = { email: body.email };
    const fieldsToReturn = "-_id -password -createdAt -updatedAt";
    const model = "user";
    const duplicate = await (0, mongoServices_1.findResourceByProperty)(searchCriteria, fieldsToReturn, model);
    if (duplicate) {
        throw new conflict_1.default("Please try a different email address");
    }
    const userCreated = await (0, mongoServices_1.insertResource)(body, model);
    if (!userCreated) {
        throw new bad_request_1.default("User not created");
    }
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "User created successfully!" });
};
exports.createUser = createUser;
const getUsers = async (req, res) => {
    const fieldsToReturn = "-password -createdAt -updatedAt";
    const model = "user";
    const usersFound = await (0, mongoServices_1.findAllResources)(fieldsToReturn, model);
    if (!usersFound || usersFound.length === 0) {
        throw new not_found_1.default("No users found");
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(usersFound);
};
exports.getUsers = getUsers;
const getUser = async ({ params }, res) => {
    const { id: userId } = params;
    const isValidUserId = (0, mongoServices_1.isValidId)(userId);
    if (isValidUserId === false) {
        throw new bad_request_1.default("Invalid user Id");
    }
    const fieldsToReturn = "-password -createdAt -updatedAt";
    const model = "user";
    const userFound = await (0, mongoServices_1.findResourceById)(userId, fieldsToReturn, model);
    if (!userFound) {
        throw new not_found_1.default("User not found");
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(userFound);
};
exports.getUser = getUser;
const updateUser = async ({ body, params }, res) => {
    const { id: userId } = params;
    const isValidUserId = (0, mongoServices_1.isValidId)(userId);
    if (isValidUserId === false) {
        throw new bad_request_1.default("Invalid user Id");
    }
    const { school: schoolId } = body;
    const isValidSchoolId = (0, mongoServices_1.isValidId)(schoolId);
    if (isValidSchoolId === false) {
        throw new bad_request_1.default("Invalid school Id");
    }
    const searchCriteria = { email: body.email };
    const fieldsToReturn = "-password -createdAt -updatedAt";
    const model = "user";
    const duplicate = await (0, mongoServices_1.findResourceByProperty)(searchCriteria, fieldsToReturn, model);
    if (duplicate && (duplicate === null || duplicate === void 0 ? void 0 : duplicate._id.toString()) !== userId) {
        throw new conflict_1.default("Please try a different email address");
    }
    const userUpdated = await (0, mongoServices_1.updateResource)(userId, body, model);
    if (!userUpdated) {
        throw new not_found_1.default("User not updated");
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "User updated" });
};
exports.updateUser = updateUser;
const deleteUser = async ({ params }, res) => {
    const { id: userId } = params;
    const isValidUserId = (0, mongoServices_1.isValidId)(userId);
    if (isValidUserId === false) {
        throw new bad_request_1.default("Invalid user Id");
    }
    const model = "user";
    const userDeleted = await (0, mongoServices_1.deleteResource)(userId, model);
    if (!userDeleted) {
        throw new not_found_1.default("User not deleted");
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "User deleted" });
};
exports.deleteUser = deleteUser;
