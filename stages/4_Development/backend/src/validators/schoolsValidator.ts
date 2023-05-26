import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../lib/helpers/validateHelper";
import { isValidId } from "../services/mongoServices";

// @fields: body {name:[string]}
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
  check("groupMaxNumStudents")
    .exists()
    .withMessage("Please add the group max number of students")
    .bail()
    .notEmpty()
    .withMessage("The group max number of students field is empty")
    .bail()
    .isNumeric()
    .withMessage("group  max  number of students value is not valid")
    .bail()
    .custom((value) => {
      const maxNumberStudentsPerGroup = 1000;
      if (value > maxNumberStudentsPerGroup) {
        return false;
      } else if (value <= maxNumberStudentsPerGroup) {
        return true;
      }
    })
    .withMessage(`group max number of students must not exceed 1000 students`),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: params: {id:[string]}
const validateGetSchool = [
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

// @fields: params: {id:[string]},  body: {name:[string]}
const validateUpdateSchool = [
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
    .withMessage("The name must not exceed 100 characters"),
  check("groupMaxNumStudents")
    .exists()
    .withMessage("Please add the group max number of students")
    .bail()
    .notEmpty()
    .withMessage("The group max number of students field is empty")
    .bail()
    .isNumeric()
    .withMessage("group  max  number of students value is not valid")
    .bail()
    .custom((value) => {
      const maxNumberStudentsPerGroup = 1000;
      if (value > maxNumberStudentsPerGroup) {
        return false;
      } else if (value <= maxNumberStudentsPerGroup) {
        return true;
      }
    })
    .withMessage(`group max number of students must not exceed 1000 students`),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: params: {id:[string]}}
const validateDeleteSchool = [
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

export {
  validateCreateSchool,
  validateGetSchool,
  validateUpdateSchool,
  validateDeleteSchool,
};
