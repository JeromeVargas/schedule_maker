import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../helpers/validateHelper";

const validateCreateTeacher = [
  check("user_id")
    .exists()
    .withMessage("Please add the teacher`s user's id")
    .bail()
    .notEmpty()
    .withMessage("The teacher`s user's id field is empty")
    .bail()
    .isString()
    .withMessage("The teacher`s user's id is not valid")
    .bail()
    .isAlphanumeric()
    .withMessage("The teacher`s user's id is Non-properly formatted")
    .bail()
    .isLength({ min: 24, max: 24 })
    .withMessage("The teacher`s user's id is not in the correct format"),
  check("coordinator_id")
    .exists()
    .withMessage("Please add the coordinator's id")
    .bail()
    .notEmpty()
    .withMessage("The coordinator's id field is empty")
    .bail()
    .isString()
    .withMessage("The coordinator's id is not valid")
    .bail()
    .isAlphanumeric()
    .withMessage("The coordinator's id is Non-properly formatted")
    .bail()
    .isLength({ min: 24, max: 24 })
    .withMessage("The coordinator's id is not in the correct format"),
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
    .withMessage("the contract type provided is not a valid option"),
  check("hoursAssignable")
    .exists()
    .withMessage("Please add the number of hours assignable to the teacher")
    .bail()
    .notEmpty()
    .withMessage("The hours assignable field is empty")
    .bail()
    .isNumeric()
    .withMessage("hours assignable value is not valid")
    .bail()
    .custom((value) => {
      const maxHours = 70;
      if (value > maxHours) {
        return false;
      } else if (value <= maxHours) {
        return true;
      }
    })
    .withMessage(`hours assignable must not exceed 70 hours`),
  check("hoursAssigned")
    .exists()
    .withMessage("Please add the number of hours assigned to the teacher")
    .bail()
    .notEmpty()
    .withMessage("The hours assigned field is empty")
    .bail()
    .isNumeric()
    .withMessage("hours assigned value is not valid")
    .bail()
    .custom((value, { req }) => {
      if (value > req.body.hoursAssignable) {
        return false;
      } else if (value <= req.body.hoursAssignable) {
        return true;
      }
    })
    .withMessage("hours assigned must not exceed the hours assignable"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateGetTeacher = [
  check("id").isAlphanumeric().withMessage("Non-properly formatted id").bail(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateUpdateTeacher = [
  check("user_id")
    .exists()
    .withMessage("Please add the teacher`s user's id")
    .bail()
    .notEmpty()
    .withMessage("The teacher`s user's id field is empty")
    .bail()
    .isString()
    .withMessage("The teacher`s user's id is not valid")
    .bail()
    .isAlphanumeric()
    .withMessage("The teacher`s user's id is Non-properly formatted")
    .bail()
    .isLength({ min: 24, max: 24 })
    .withMessage("The teacher`s user's id is not in the correct format"),
  check("coordinator_id")
    .exists()
    .withMessage("Please add the coordinator's id")
    .bail()
    .notEmpty()
    .withMessage("The coordinator's id field is empty")
    .bail()
    .isString()
    .withMessage("The coordinator's id is not valid")
    .bail()
    .isAlphanumeric()
    .withMessage("The coordinator's id is Non-properly formatted")
    .bail()
    .isLength({ min: 24, max: 24 })
    .withMessage("The coordinator's id is not in the correct format"),
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
    .withMessage("the contract type provided is not a valid option"),
  check("hoursAssignable")
    .exists()
    .withMessage("Please add the number of hours assignable to the teacher")
    .bail()
    .notEmpty()
    .withMessage("The hours assignable field is empty")
    .bail()
    .isNumeric()
    .withMessage("hours assignable value is not valid")
    .bail()
    .custom((value) => {
      const maxHours = 70;
      if (value > maxHours) {
        return false;
      } else if (value <= maxHours) {
        return true;
      }
    })
    .withMessage(`hours assignable must not exceed 70 hours`),
  check("hoursAssigned")
    .exists()
    .withMessage("Please add the number of hours assigned to the teacher")
    .bail()
    .notEmpty()
    .withMessage("The hours assigned field is empty")
    .bail()
    .isNumeric()
    .withMessage("hours assigned value is not valid")
    .bail()
    .custom((value, { req }) => {
      if (value > req.body.hoursAssignable) {
        return false;
      } else if (value <= req.body.hoursAssignable) {
        return true;
      }
    })
    .withMessage("hours assigned must not exceed the hours assignable"),
  check("id").isAlphanumeric().withMessage("Non-properly formatted id").bail(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateDeleteTeacher = [
  check("id").isAlphanumeric().withMessage("Non-properly formatted id").bail(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export {
  validateCreateTeacher,
  validateGetTeacher,
  validateUpdateTeacher,
  validateDeleteTeacher,
};
