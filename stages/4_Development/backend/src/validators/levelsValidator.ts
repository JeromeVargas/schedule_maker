import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../lib/helpers/validateHelper";
import { isValidId } from "../services/mongoServices";

// @fields: body: {fieldOne:[string], fieldTwo:[string], fieldThree:[string], fieldFour:[string], fieldFive:[string], fieldSix:[string], fieldSeven:[string], fieldEight:[boolean]}
const validateCreateLevel = [
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
  check("schedule_id")
    .exists()
    .withMessage("Please add the schedule id")
    .bail()
    .notEmpty()
    .withMessage("The schedule id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The schedule id is not valid`),
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
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: body: {school_id:[string]}
const validateGetLevels = [
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
const validateGetLevel = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The level id is not valid`),
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

// @fields: params: {id:[string]},  body: {fieldOne:[string], fieldTwo:[string], fieldThree:[string], fieldFour:[string], fieldFive:[string], fieldSix:[string], fieldSeven:[string], fieldEight:[boolean]}
const validateUpdateLevel = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The level id is not valid`),
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
  check("schedule_id")
    .exists()
    .withMessage("Please add the schedule id")
    .bail()
    .notEmpty()
    .withMessage("The schedule id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The schedule id is not valid`),
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
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: params: {id:[string]},  body: {school_id:[string]}
const validateDeleteLevel = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The level id is not valid`),
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
  validateCreateLevel,
  validateGetLevels,
  validateGetLevel,
  validateUpdateLevel,
  validateDeleteLevel,
};
