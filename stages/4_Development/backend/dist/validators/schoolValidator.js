"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreate = void 0;
const express_validator_1 = require("express-validator");
const validateHelper_1 = __importDefault(require("../helpers/validateHelper"));
const validateCreate = [
    (0, express_validator_1.check)("name")
        .exists()
        .withMessage("Please add a name")
        .bail()
        .notEmpty()
        .withMessage("the name field is empty")
        .bail()
        .isString()
        .withMessage("The name is not valid"),
    (req, res, next) => {
        (0, validateHelper_1.default)(req, res, next);
    },
];
exports.validateCreate = validateCreate;
