"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeleteASchool = exports.validateUpdateASchool = exports.validateGetASchool = exports.validateCreateASchool = void 0;
const express_validator_1 = require("express-validator");
const validateHelper_1 = __importDefault(require("../helpers/validateHelper"));
const validateCreateASchool = [
    (0, express_validator_1.check)("name")
        .exists()
        .withMessage("Please add a school name")
        .bail()
        .notEmpty()
        .withMessage("The school name field is empty")
        .bail()
        .isString()
        .withMessage("The school name is not valid")
        .isLength({ min: 1, max: 100 })
        .withMessage("The name must not exceed 100 characters"),
    (req, res, next) => {
        (0, validateHelper_1.default)(req, res, next);
    },
];
exports.validateCreateASchool = validateCreateASchool;
const validateGetASchool = [
    (0, express_validator_1.check)("id", { message: "Non-properly formatted id" })
        .isAlphanumeric()
        .bail()
        .isLength({ min: 24, max: 24 }),
    (req, res, next) => {
        (0, validateHelper_1.default)(req, res, next);
    },
];
exports.validateGetASchool = validateGetASchool;
const validateUpdateASchool = [
    (0, express_validator_1.check)("name")
        .exists()
        .withMessage("Please add a name")
        .bail()
        .notEmpty()
        .withMessage("The name field is empty")
        .bail()
        .isString()
        .withMessage("The school name is not valid")
        .isLength({ min: 1, max: 100 })
        .withMessage("The name must not exceed 100 characters"),
    (0, express_validator_1.check)("id", { message: "Non-properly formatted id" })
        .isAlphanumeric()
        .bail()
        .isLength({ min: 24, max: 24 }),
    (req, res, next) => {
        (0, validateHelper_1.default)(req, res, next);
    },
];
exports.validateUpdateASchool = validateUpdateASchool;
const validateDeleteASchool = [
    (0, express_validator_1.check)("id", { message: "Non-properly formatted id" })
        .isAlphanumeric()
        .bail()
        .isLength({ min: 24, max: 24 }),
    (req, res, next) => {
        (0, validateHelper_1.default)(req, res, next);
    },
];
exports.validateDeleteASchool = validateDeleteASchool;
