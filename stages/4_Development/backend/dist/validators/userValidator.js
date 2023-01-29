"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeleteAUser = exports.validateUpdateAUser = exports.validateGetAUser = exports.validateCreateAUser = void 0;
const express_validator_1 = require("express-validator");
const validateHelper_1 = __importDefault(require("../helpers/validateHelper"));
const validateCreateAUser = [
    (0, express_validator_1.check)("firstName")
        .exists()
        .withMessage("Please add the user's first name")
        .bail()
        .notEmpty()
        .withMessage("The first name field is empty")
        .bail()
        .isString()
        .withMessage("The first name is not valid")
        .isLength({ min: 1, max: 50 })
        .withMessage("The first name must not exceed 50 characters"),
    (0, express_validator_1.check)("lastName")
        .exists()
        .withMessage("Please add the user's last name")
        .bail()
        .notEmpty()
        .withMessage("The last name field is empty")
        .bail()
        .isString()
        .withMessage("The last name is not valid")
        .isLength({ min: 1, max: 50 })
        .withMessage("The last name must not exceed 50 characters"),
    (0, express_validator_1.check)("school")
        .exists()
        .withMessage("Please add the user's school")
        .bail()
        .notEmpty()
        .withMessage("The school field is empty")
        .bail()
        .isString()
        .withMessage("The school id is not valid")
        .bail()
        .isAlphanumeric()
        .withMessage("The school id is Non-properly formatted")
        .bail()
        .isLength({ min: 24, max: 24 })
        .withMessage("The school id is not in the correct format"),
    (0, express_validator_1.check)("email")
        .exists()
        .withMessage("Please add the user's email")
        .bail()
        .notEmpty()
        .withMessage("The email field is empty")
        .bail()
        .isString()
        .withMessage("email is not valid")
        .bail()
        .isEmail()
        .withMessage("please add a correct email address")
        .isLength({ min: 1, max: 50 })
        .withMessage("The email must not exceed 50 characters"),
    (0, express_validator_1.check)("password")
        .exists()
        .withMessage("Please add the user's password")
        .bail()
        .notEmpty()
        .withMessage("The password field is empty")
        .bail()
        .isString()
        .withMessage("The password is not valid")
        .isLength({ min: 8 })
        .withMessage("The password must be at least 8 characters long"),
    (0, express_validator_1.check)("role")
        .exists()
        .withMessage("Please add the user's role")
        .bail()
        .notEmpty()
        .withMessage("The role field is empty")
        .bail()
        .isString()
        .withMessage("role is not valid")
        .bail()
        .isIn(["headmaster", "coordinator", "teacher"])
        .withMessage("the role provided is not a valid option"),
    (0, express_validator_1.check)("status")
        .exists()
        .withMessage("Please add the user's current status")
        .bail()
        .notEmpty()
        .withMessage("The status field is empty")
        .bail()
        .isString()
        .withMessage("status is not valid")
        .bail()
        .isIn(["active", "inactive", "suspended"])
        .withMessage("the status provided is not a valid option"),
    (req, res, next) => {
        (0, validateHelper_1.default)(req, res, next);
    },
];
exports.validateCreateAUser = validateCreateAUser;
const validateGetAUser = [
    (0, express_validator_1.check)("id", { message: "Non-properly formatted id" })
        .isAlphanumeric()
        .bail()
        .isLength({ min: 24, max: 24 }),
    (req, res, next) => {
        (0, validateHelper_1.default)(req, res, next);
    },
];
exports.validateGetAUser = validateGetAUser;
const validateUpdateAUser = [
    (0, express_validator_1.check)("firstName")
        .exists()
        .withMessage("Please add the user's first name")
        .bail()
        .notEmpty()
        .withMessage("The first name field is empty")
        .bail()
        .isString()
        .withMessage("The first name is not valid")
        .isLength({ min: 1, max: 50 })
        .withMessage("The first name must not exceed 50 characters"),
    (0, express_validator_1.check)("lastName")
        .exists()
        .withMessage("Please add the user's last name")
        .bail()
        .notEmpty()
        .withMessage("The last name field is empty")
        .bail()
        .isString()
        .withMessage("The last name is not valid")
        .isLength({ min: 1, max: 50 })
        .withMessage("The last name must not exceed 50 characters"),
    (0, express_validator_1.check)("school")
        .exists()
        .withMessage("Please add the user's school")
        .bail()
        .notEmpty()
        .withMessage("The school field is empty")
        .bail()
        .isString()
        .withMessage("The school id is not valid")
        .bail()
        .isAlphanumeric()
        .withMessage("The school id is Non-properly formatted")
        .bail()
        .isLength({ min: 24, max: 24 })
        .withMessage("The school id is not in the correct format"),
    (0, express_validator_1.check)("email")
        .exists()
        .withMessage("Please add the user's email")
        .bail()
        .notEmpty()
        .withMessage("The email field is empty")
        .bail()
        .isString()
        .withMessage("email is not valid")
        .bail()
        .isEmail()
        .withMessage("please add a correct email address")
        .isLength({ min: 1, max: 50 })
        .withMessage("The email must not exceed 50 characters"),
    (0, express_validator_1.check)("password")
        .exists()
        .withMessage("Please add the user's password")
        .bail()
        .notEmpty()
        .withMessage("The password field is empty")
        .bail()
        .isString()
        .withMessage("The password is not valid")
        .isLength({ min: 8 })
        .withMessage("The password must be at least 8 characters long"),
    (0, express_validator_1.check)("role")
        .exists()
        .withMessage("Please add the user's role")
        .bail()
        .notEmpty()
        .withMessage("The role field is empty")
        .bail()
        .isString()
        .withMessage("role is not valid")
        .bail()
        .isIn(["headmaster", "coordinator", "teacher"])
        .withMessage("the role provided is not a valid option"),
    (0, express_validator_1.check)("status")
        .exists()
        .withMessage("Please add the user's current status")
        .bail()
        .notEmpty()
        .withMessage("The status field is empty")
        .bail()
        .isString()
        .withMessage("status is not valid")
        .bail()
        .isIn(["active", "inactive", "suspended"])
        .withMessage("the status provided is not a valid option"),
    (0, express_validator_1.check)("id", { message: "Non-properly formatted id" })
        .isAlphanumeric()
        .bail()
        .isLength({ min: 24, max: 24 }),
    (req, res, next) => {
        (0, validateHelper_1.default)(req, res, next);
    },
];
exports.validateUpdateAUser = validateUpdateAUser;
const validateDeleteAUser = [
    (0, express_validator_1.check)("id", { message: "Non-properly formatted id" })
        .isAlphanumeric()
        .bail()
        .isLength({ min: 24, max: 24 }),
    (req, res, next) => {
        (0, validateHelper_1.default)(req, res, next);
    },
];
exports.validateDeleteAUser = validateDeleteAUser;
