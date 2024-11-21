import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../../lib/express-validator/validateHelper";
import { isValidId } from "../../lib/utilities/validation";

export const validateCreateSchedule = [
  check("school_id")
    .exists()
    .withMessage("Please add the school id")
    .bail()
    .notEmpty()
    .withMessage("The school field is empty")
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
  check("name")
    .exists()
    .withMessage("Please add a schedule name")
    .bail()
    .notEmpty()
    .withMessage("The schedule name field is empty")
    .bail()
    .isString()
    .withMessage("The schedule name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The schedule name must not exceed 100 characters")
    .blacklist("%,$")
    .escape()
    .trim(),
  check("dayStart")
    .exists()
    .withMessage("Please add the school day start time")
    .bail()
    .notEmpty()
    .withMessage("The day start field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("day start value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The day start time must not exceed 9 digits"),
  check("shiftNumberMinutes")
    .exists()
    .withMessage("Please add the school shift number of minutes")
    .bail()
    .notEmpty()
    .withMessage("The number of minutes field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("number of minutes value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The day start time must not exceed 9 digits"),
  check("sessionUnitMinutes")
    .exists()
    .withMessage("Please add the session unit length")
    .bail()
    .notEmpty()
    .withMessage("The session unit length field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("session unit length value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The day start time must not exceed 9 digits"),
  check("monday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Mondays")
    .bail()
    .notEmpty()
    .withMessage("The monday field is empty")
    .bail()
    .isBoolean()
    .withMessage("monday value is not valid"),
  check("tuesday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Tuesdays")
    .bail()
    .notEmpty()
    .withMessage("The tuesday field is empty")
    .bail()
    .isBoolean()
    .withMessage("tuesday value is not valid"),
  check("wednesday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Wednesdays")
    .bail()
    .notEmpty()
    .withMessage("The wednesday field is empty")
    .bail()
    .isBoolean()
    .withMessage("wednesday value is not valid"),
  check("thursday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Thursdays")
    .bail()
    .notEmpty()
    .withMessage("The thursday field is empty")
    .bail()
    .isBoolean()
    .withMessage("thursday value is not valid"),
  check("friday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Fridays")
    .bail()
    .notEmpty()
    .withMessage("The friday field is empty")
    .bail()
    .isBoolean()
    .withMessage("friday value is not valid"),
  check("saturday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Saturdays")
    .bail()
    .notEmpty()
    .withMessage("The saturday field is empty")
    .bail()
    .isBoolean()
    .withMessage("saturday value is not valid"),
  check("sunday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Sundays")
    .bail()
    .notEmpty()
    .withMessage("The sunday field is empty")
    .bail()
    .isBoolean()
    .withMessage("sunday value is not valid"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export const validateGetSchedules = [
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

export const validateGetSchedule = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The schedule id is not valid`),
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

export const validateUpdateSchedule = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The schedule id is not valid`),
  check("school_id")
    .exists()
    .withMessage("Please add the school id")
    .bail()
    .notEmpty()
    .withMessage("The school field is empty")
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
  check("name")
    .exists()
    .withMessage("Please add a schedule name")
    .bail()
    .notEmpty()
    .withMessage("The schedule name field is empty")
    .bail()
    .isString()
    .withMessage("The schedule name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The schedule name must not exceed 100 characters")
    .blacklist("%,$")
    .escape()
    .trim(),
  check("dayStart")
    .exists()
    .withMessage("Please add the school day start time")
    .bail()
    .notEmpty()
    .withMessage("The day start field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("day start value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The day start time must not exceed 9 digits"),
  check("shiftNumberMinutes")
    .exists()
    .withMessage("Please add the school shift number of minutes")
    .bail()
    .notEmpty()
    .withMessage("The number of minutes field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("number of minutes value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The day start time must not exceed 9 digits"),
  check("sessionUnitMinutes")
    .exists()
    .withMessage("Please add the session unit length")
    .bail()
    .notEmpty()
    .withMessage("The session unit length field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("session unit length value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The day start time must not exceed 9 digits"),
  check("monday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Mondays")
    .bail()
    .notEmpty()
    .withMessage("The monday field is empty")
    .bail()
    .isBoolean()
    .withMessage("monday value is not valid"),
  check("tuesday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Tuesdays")
    .bail()
    .notEmpty()
    .withMessage("The tuesday field is empty")
    .bail()
    .isBoolean()
    .withMessage("tuesday value is not valid"),
  check("wednesday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Wednesdays")
    .bail()
    .notEmpty()
    .withMessage("The wednesday field is empty")
    .bail()
    .isBoolean()
    .withMessage("wednesday value is not valid"),
  check("thursday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Thursdays")
    .bail()
    .notEmpty()
    .withMessage("The thursday field is empty")
    .bail()
    .isBoolean()
    .withMessage("thursday value is not valid"),
  check("friday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Fridays")
    .bail()
    .notEmpty()
    .withMessage("The friday field is empty")
    .bail()
    .isBoolean()
    .withMessage("friday value is not valid"),
  check("saturday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Saturdays")
    .bail()
    .notEmpty()
    .withMessage("The saturday field is empty")
    .bail()
    .isBoolean()
    .withMessage("saturday value is not valid"),
  check("sunday")
    .exists()
    .withMessage("Please add if the teacher is available to work on Sundays")
    .bail()
    .notEmpty()
    .withMessage("The sunday field is empty")
    .bail()
    .isBoolean()
    .withMessage("sunday value is not valid"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export const validateDeleteSchedule = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The schedule id is not valid`),
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
