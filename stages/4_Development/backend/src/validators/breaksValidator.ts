import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../helpers/validateHelper";
import { isValidId } from "../services/mongoServices";

const validateCreateBreak = [
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
    .isNumeric()
    .withMessage("start value is not valid")
    .bail()
    .custom((value) => {
      const maxMinutesInDay = 1439;
      if (value > maxMinutesInDay) {
        return false;
      } else if (value <= maxMinutesInDay) {
        return true;
      }
    })
    .withMessage(`The break start time must must not exceed the 23:59 hours`),
  check("numberMinutes")
    .exists()
    .withMessage("Please add the break number of minutes")
    .bail()
    .notEmpty()
    .withMessage("The break number of minutes field is empty")
    .bail()
    .isNumeric()
    .withMessage("break number of minutes value is not valid"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateGetBreaks = [
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

const validateGetBreak = [
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

const validateUpdateBreak = [
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
    .isNumeric()
    .withMessage("start value is not valid")
    .bail()
    .custom((value) => {
      const maxMinutesInDay = 1439;
      if (value > maxMinutesInDay) {
        return false;
      } else if (value <= maxMinutesInDay) {
        return true;
      }
    })
    .withMessage(`The break start time must must not exceed the 23:59 hours`),
  check("numberMinutes")
    .exists()
    .withMessage("Please add the break number of minutes")
    .bail()
    .notEmpty()
    .withMessage("The break number of minutes field is empty")
    .bail()
    .isNumeric()
    .withMessage("break number of minutes value is not valid"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateDeleteBreak = [
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

export {
  validateCreateBreak,
  validateGetBreaks,
  validateGetBreak,
  validateUpdateBreak,
  validateDeleteBreak,
};
