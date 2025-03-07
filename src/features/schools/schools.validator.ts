import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../../lib/express-validator/validateHelper";
import { isValidId } from "../../lib/utilities/validation";

export const validateCreateSchool = [
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
    .withMessage("The name must not exceed 100 characters")
    .blacklist("%,$")
    .trim()
    .escape(),
  check("groupMaxNumStudents")
    .exists()
    .withMessage("Please add the group max number of students")
    .bail()
    .notEmpty()
    .withMessage("The group max number of students field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("group max number of students value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("group max number of students must not exceed 9 digits"),
  check("status")
    .exists()
    .withMessage("Please add the school's current status")
    .bail()
    .notEmpty()
    .withMessage("The status field is empty")
    .bail()
    .isString()
    .withMessage("status is not valid")
    .bail()
    .isIn(["active", "inactive"])
    .withMessage("the status provided is not a valid option")
    .blacklist("%,$")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export const validateGetSchool = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export const validateUpdateSchool = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
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
    .withMessage("The name must not exceed 100 characters")
    .blacklist("%,$")
    .trim()
    .escape(),
  check("groupMaxNumStudents")
    .exists()
    .withMessage("Please add the group max number of students")
    .bail()
    .notEmpty()
    .withMessage("The group max number of students field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("group max number of students value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("group max number of students must not exceed 9 digits"),
  check("status")
    .exists()
    .withMessage("Please add the school's current status")
    .bail()
    .notEmpty()
    .withMessage("The status field is empty")
    .bail()
    .isString()
    .withMessage("status is not valid")
    .bail()
    .isIn(["active", "inactive"])
    .withMessage("the status provided is not a valid option")
    .blacklist("%,$")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export const validateDeleteSchool = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];
