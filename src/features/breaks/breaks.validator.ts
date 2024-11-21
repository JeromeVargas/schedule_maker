import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../../lib/express-validator/validateHelper";
import { isValidId } from "../../lib/utilities/validation";

export const validateCreateBreak = [
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
  check("breakStart")
    .exists()
    .withMessage("Please add the break day start time")
    .bail()
    .notEmpty()
    .withMessage("The start field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("start value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The break start time must not exceed 9 digits"),
  check("numberMinutes")
    .exists()
    .withMessage("Please add the break number of minutes")
    .bail()
    .notEmpty()
    .withMessage("The break number of minutes field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("break number of minutes value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The break number of minutes must not exceed 9 digits"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export const validateGetBreaks = [
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

export const validateGetBreak = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The break id is not valid`),
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

// @fields: params: {id:[string]},  body {school_id:[string] , schedule_id:[string], breakStart:[number], numberMinutes:[number]}
export const validateUpdateBreak = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The break id is not valid`),
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
  check("breakStart")
    .exists()
    .withMessage("Please add the break day start time")
    .bail()
    .notEmpty()
    .withMessage("The start field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("start value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The break start time must not exceed 9 digits"),
  check("numberMinutes")
    .exists()
    .withMessage("Please add the break number of minutes")
    .bail()
    .notEmpty()
    .withMessage("The break number of minutes field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("break number of minutes value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The break start time must not exceed 9 digits"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export const validateDeleteBreak = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The break id is not valid`),
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
