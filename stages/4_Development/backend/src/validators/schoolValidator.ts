import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../helpers/validateHelper";

const validateCreateASchool = [
  check("name")
    .exists()
    .withMessage("Please add a name")
    .bail()
    .notEmpty()
    .withMessage("The name field is empty")
    .bail()
    .isString()
    .withMessage("The name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The name must not exceed 100 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateGetASchool = [
  check("id", { message: "Non-properly formatted id" })
    .isAlphanumeric()
    .bail()
    .isLength({ min: 24, max: 24 }),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateUpdateASchool = [
  check("name")
    .exists()
    .withMessage("Please add a name")
    .bail()
    .notEmpty()
    .withMessage("The name field is empty")
    .bail()
    .isString()
    .withMessage("The name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The name must not exceed 100 characters"),
  check("id", { message: "Non-properly formatted id" })
    .isAlphanumeric()
    .bail()
    .isLength({ min: 24, max: 24 }),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateDeleteASchool = [
  check("id", { message: "Non-properly formatted id" })
    .isAlphanumeric()
    .bail()
    .isLength({ min: 24, max: 24 }),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export {
  validateCreateASchool,
  validateGetASchool,
  validateUpdateASchool,
  validateDeleteASchool,
};
