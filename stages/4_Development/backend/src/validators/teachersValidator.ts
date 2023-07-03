import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../lib/helpers/validateHelper";
import { isValidId } from "../services/mongoServices";

// @fields: body: {user_id: [string];  coordinator_id: [string];  contractType: [string];  hoursAssignable: number;  hoursAssigned: number}
const validateCreateTeacher = [
  check("school_id")
    .exists()
    .withMessage("Please add the user's school id")
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
  check("user_id")
    .exists()
    .withMessage("Please add the teacher`s user id")
    .bail()
    .notEmpty()
    .withMessage("The teacher's user id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher's user id is not valid`),
  check("coordinator_id")
    .exists()
    .withMessage("Please add the coordinator's id")
    .bail()
    .notEmpty()
    .withMessage("The coordinator's id field is empty")
    .bail()
    .isString()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The coordinator's id is not valid`),
  check("contractType")
    .exists()
    .withMessage("Please add the teacher`s contract type")
    .bail()
    .notEmpty()
    .withMessage("The contract type field is empty")
    .bail()
    .isString()
    .withMessage("contract type is not valid")
    .bail()
    .isIn(["full-time", "part-time", "substitute"])
    .withMessage("the contract type provided is not a valid option")
    .escape()
    .trim(),
  check("hoursAssignable")
    .exists()
    .withMessage("Please add the number of hours assignable to the teacher")
    .bail()
    .notEmpty()
    .withMessage("The hours assignable field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("hours assignable value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The start time must not exceed 9 digits"),
  check("hoursAssigned")
    .exists()
    .withMessage("Please add the number of hours assigned to the teacher")
    .bail()
    .notEmpty()
    .withMessage("The hours assigned field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("hours assigned value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The start time must not exceed 9 digits"),
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

// @fields: body: {school_id:[string]}
const validateGetTeachers = [
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
const validateGetTeacher = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher id is not valid`),
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

// @fields: params: {id:[string]},  body: {user_id: [string];  coordinator_id: [string];  contractType: [string];  hoursAssignable: number;  hoursAssigned: number}
const validateUpdateTeacher = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher's id is not valid`),
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
  check("user_id")
    .exists()
    .withMessage("Please add the teacher's user id")
    .bail()
    .notEmpty()
    .withMessage("The teacher`s user id field is empty")
    .bail()
    .isString()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher's user id is not valid`),
  check("coordinator_id")
    .exists()
    .withMessage("Please add the coordinator's user id")
    .bail()
    .notEmpty()
    .withMessage("The coordinator's id field is empty")
    .bail()
    .isString()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The coordinator's id is not valid`),
  check("contractType")
    .exists()
    .withMessage("Please add the teacher`s contract type")
    .bail()
    .notEmpty()
    .withMessage("The contract type field is empty")
    .bail()
    .isString()
    .withMessage("contract type is not valid")
    .bail()
    .isIn(["full-time", "part-time", "substitute"])
    .withMessage("the contract type provided is not a valid option")
    .escape()
    .trim(),
  check("hoursAssignable")
    .exists()
    .withMessage("Please add the number of hours assignable to the teacher")
    .bail()
    .notEmpty()
    .withMessage("The hours assignable field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("hours assignable value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The start time must not exceed 9 digits"),
  check("hoursAssigned")
    .exists()
    .withMessage("Please add the number of hours assigned to the teacher")
    .bail()
    .notEmpty()
    .withMessage("The hours assigned field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("hours assigned value is not valid")
    .bail()
    .isLength({ min: 1, max: 9 })
    .withMessage("The start time must not exceed 9 digits"),
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

// @fields: params: {id:[string]},  body: {school_id:[string]}
const validateDeleteTeacher = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher's id is not valid`),
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
  validateCreateTeacher,
  validateGetTeachers,
  validateGetTeacher,
  validateUpdateTeacher,
  validateDeleteTeacher,
};
