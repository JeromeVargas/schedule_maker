import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../helpers/validateHelper";

const validateCreateSchool = [
  check("name")
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
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateGetSchool = [
  check("id").isAlphanumeric().withMessage("Non-properly formatted id").bail(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateUpdateSchool = [
  check("name")
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
  check("id").isAlphanumeric().withMessage("Non-properly formatted id").bail(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateDeleteSchool = [
  check("id").isAlphanumeric().withMessage("Non-properly formatted id").bail(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export {
  validateCreateSchool,
  validateGetSchool,
  validateUpdateSchool,
  validateDeleteSchool,
};
