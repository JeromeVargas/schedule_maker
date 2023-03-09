import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../helpers/validateHelper";

const validateCreateField = [
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .isAlphanumeric()
    .withMessage("The school id is Non-properly formatted"),
  check("name")
    .exists()
    .withMessage("Please add a field name")
    .bail()
    .notEmpty()
    .withMessage("The field name is empty")
    .bail()
    .isString()
    .withMessage("The field name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The field name must not exceed 100 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateGetFields = [
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .isAlphanumeric()
    .withMessage("Non-properly formatted school id"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateGetField = [
  check("id")
    .isAlphanumeric()
    .withMessage("Non-properly formatted field id")
    .bail(),
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .isAlphanumeric()
    .withMessage("Non-properly formatted school id"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateUpdateField = [
  check("id")
    .isAlphanumeric()
    .withMessage("Non-properly formatted field id")
    .bail(),
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .isAlphanumeric()
    .withMessage("Non-properly formatted school id"),
  check("name")
    .exists()
    .withMessage("Please add a field name")
    .bail()
    .notEmpty()
    .withMessage("The name field is empty")
    .bail()
    .isString()
    .withMessage("The field name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The name must not exceed 100 characters"),
  check("prevName")
    .exists()
    .withMessage("Please add the previous field name")
    .bail()
    .notEmpty()
    .withMessage("The previous field name is empty")
    .bail()
    .isString()
    .withMessage("The previous field name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The previous field name must not exceed 100 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateDeleteField = [
  check("id")
    .isAlphanumeric()
    .withMessage("Non-properly formatted field id")
    .bail(),
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .isAlphanumeric()
    .withMessage("Non-properly formatted school id"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export {
  validateCreateField,
  validateGetFields,
  validateGetField,
  validateUpdateField,
  validateDeleteField,
};
