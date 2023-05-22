import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../lib/helpers/validateHelper";
import { isValidId } from "../services/mongoServices";

// @fields: body {school_id:[string] , name:[string], dayStart:[number], shiftNumberMinutes:[number], classUnitMinutes:[number], monday:[boolean], tuesday:[boolean], wednesday:[boolean], thursday:[boolean], friday:[boolean], saturday:[boolean], sunday:[boolean],}
const validateCreateSchedule = [
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
    .withMessage("The schedule name must not exceed 100 characters"),
  check("dayStart")
    .exists()
    .withMessage("Please add the school day start time")
    .bail()
    .notEmpty()
    .withMessage("The day start field is empty")
    .bail()
    .isNumeric()
    .withMessage("day start value is not valid")
    .bail()
    .custom((value) => {
      const maxMinutesInDay = 1439;
      if (value > maxMinutesInDay) {
        return false;
      } else if (value <= maxMinutesInDay) {
        return true;
      }
    })
    .withMessage(`The school start time must must not exceed the 23:59 hours`),
  check("shiftNumberMinutes")
    .exists()
    .withMessage("Please add the school shift number of minutes")
    .bail()
    .notEmpty()
    .withMessage("The number of minutes field is empty")
    .bail()
    .isNumeric()
    .withMessage("number of minutes value is not valid")
    .bail()
    .custom((value, { req }) => {
      const maxMinutesInDay = 1439;
      const remainingMinutesInDay = maxMinutesInDay - req.body.dayStart;
      if (value > remainingMinutesInDay) {
        return false;
      } else if (value <= remainingMinutesInDay) {
        return true;
      }
    })
    .withMessage(
      "There is not enough time to allocate the entire shift in a day"
    ),
  check("classUnitMinutes")
    .exists()
    .withMessage("Please add the class unit length")
    .bail()
    .notEmpty()
    .withMessage("The class unit length field is empty")
    .bail()
    .isNumeric()
    .withMessage("class unit length value is not valid")
    .bail()
    .custom((value, { req }) => {
      const maxMinutesInDay = 1439;
      const remainingMinutesInDay = maxMinutesInDay - req.body.dayStart;
      if (value > remainingMinutesInDay) {
        return false;
      } else if (value <= remainingMinutesInDay) {
        return true;
      }
    })
    .withMessage(
      "There is not enough time available to allocate any class in a day"
    )
    .bail()
    .custom((value, { req }) => {
      if (value > req.body.shiftNumberMinutes) {
        return false;
      } else if (value <= req.body.shiftNumberMinutes) {
        return true;
      }
    })
    .withMessage(
      "There is not enough time available to allocate any class in the shift"
    ),
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

// @fields: body {school_id:[string]}
const validateGetSchedules = [
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
const validateGetSchedule = [
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

// @fields: params: {id:[string]},  body {school_id:[string] , name:[string], dayStart:[number], shiftNumberMinutes:[number], classUnitMinutes:[number], monday:[boolean], tuesday:[boolean], wednesday:[boolean], thursday:[boolean], friday:[boolean], saturday:[boolean], sunday:[boolean],}
const validateUpdateSchedule = [
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
    .withMessage("The schedule name must not exceed 100 characters"),
  check("dayStart")
    .exists()
    .withMessage("Please add the school day start time")
    .bail()
    .notEmpty()
    .withMessage("The day start field is empty")
    .bail()
    .isNumeric()
    .withMessage("day start value is not valid")
    .bail()
    .custom((value) => {
      const maxMinutesInDay = 1439;
      if (value > maxMinutesInDay) {
        return false;
      } else if (value <= maxMinutesInDay) {
        return true;
      }
    })
    .withMessage(`The school start time must must not exceed the 23:59 hours`),
  check("shiftNumberMinutes")
    .exists()
    .withMessage("Please add the school shift number of minutes")
    .bail()
    .notEmpty()
    .withMessage("The number of minutes field is empty")
    .bail()
    .isNumeric()
    .withMessage("number of minutes value is not valid")
    .bail()
    .custom((value, { req }) => {
      const maxMinutesInDay = 1439;
      const remainingMinutesInDay = maxMinutesInDay - req.body.dayStart;
      if (value > remainingMinutesInDay) {
        return false;
      } else if (value <= remainingMinutesInDay) {
        return true;
      }
    })
    .withMessage(
      "There is not enough time to allocate the entire shift in a day"
    ),
  check("classUnitMinutes")
    .exists()
    .withMessage("Please add the class unit length")
    .bail()
    .notEmpty()
    .withMessage("The class unit length field is empty")
    .bail()
    .isNumeric()
    .withMessage("class unit length value is not valid")
    .bail()
    .custom((value, { req }) => {
      const maxMinutesInDay = 1439;
      const remainingMinutesInDay = maxMinutesInDay - req.body.dayStart;
      if (value > remainingMinutesInDay) {
        return false;
      } else if (value <= remainingMinutesInDay) {
        return true;
      }
    })
    .withMessage(
      "There is not enough time available to allocate any class in a day"
    )
    .bail()
    .custom((value, { req }) => {
      360;
      if (value > req.body.shiftNumberMinutes) {
        return false;
      } else if (value <= req.body.shiftNumberMinutes) {
        return true;
      }
    })
    .withMessage(
      "There is not enough time available to allocate any class in the shift"
    ),
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
const validateDeleteSchedule = [
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

export {
  validateCreateSchedule,
  validateGetSchedules,
  validateGetSchedule,
  validateUpdateSchedule,
  validateDeleteSchedule,
};
