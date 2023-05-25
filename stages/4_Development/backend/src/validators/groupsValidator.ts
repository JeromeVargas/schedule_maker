import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../lib/helpers/validateHelper";
import { isValidId } from "../services/mongoServices";

// @fields: body {school_id:[string] , schedule_id:[string], name:[string], numberStudents:[number]}
const validateCreateGroup = [
  check("school_id")
    .exists()
    .withMessage("Please add the school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
  check("level_id")
    .exists()
    .withMessage("Please add the level id")
    .bail()
    .notEmpty()
    .withMessage("The level id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The level id is not valid`),
  check("name")
    .exists()
    .withMessage("Please add a level name")
    .bail()
    .notEmpty()
    .withMessage("The level name field is empty")
    .bail()
    .isString()
    .withMessage("The level name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The level name must not exceed 100 characters"),
  check("numberStudents")
    .exists()
    .withMessage("Please add the group number of students")
    .bail()
    .notEmpty()
    .withMessage("The group number of students field is empty")
    .bail()
    .isNumeric()
    .withMessage("group number of students value is not valid"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: body: {school_id:[string]}
const validateGetGroups = [
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
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

// @fields: params: {id:[string]},  body: {school_id:[string]}
const validateGetGroup = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The group id is not valid`),
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
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

// @fields: params: {id:[string]},  body {school_id:[string] , schedule_id:[string], name:[string], numberStudents:[number]}
const validateUpdateGroup = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The group id is not valid`),
  check("school_id")
    .exists()
    .withMessage("Please add the school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
  check("level_id")
    .exists()
    .withMessage("Please add the level id")
    .bail()
    .notEmpty()
    .withMessage("The level id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The level id is not valid`),
  check("name")
    .exists()
    .withMessage("Please add a level name")
    .bail()
    .notEmpty()
    .withMessage("The level name field is empty")
    .bail()
    .isString()
    .withMessage("The level name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The level name must not exceed 100 characters"),
  check("numberStudents")
    .exists()
    .withMessage("Please add the group number of students")
    .bail()
    .notEmpty()
    .withMessage("The group number of students field is empty")
    .bail()
    .isNumeric()
    .withMessage("group number of students value is not valid"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: params: {id:[string]},  body: {school_id:[string]}
const validateDeleteGroup = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The group id is not valid`),
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
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
  validateCreateGroup,
  validateGetGroups,
  validateGetGroup,
  validateUpdateGroup,
  validateDeleteGroup,
};
