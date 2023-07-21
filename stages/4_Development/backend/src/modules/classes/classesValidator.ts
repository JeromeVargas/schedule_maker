import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../../lib/helpers/validateHelper";
import { isValidId } from "../../lib/utilities/utils";

// @fields: body {school_id:[string], subject_id:[string], coordinator_id:[string], teacherField_id:[string], startTime:[number], groupScheduleSlot:[number], teacherScheduleSlot:[number]}
const validateCreateClass = [
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
  check("coordinator_id")
    .exists()
    .withMessage("Please add the coordinator id")
    .bail()
    .notEmpty()
    .withMessage("The coordinator id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The coordinator id is not valid`),
  check("subject_id")
    .exists()
    .withMessage("Please add the subject id")
    .bail()
    .notEmpty()
    .withMessage("The subject id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The subject id is not valid`),
  check("teacherField_id")
    .exists()
    .withMessage("Please add the teacher_field id")
    .bail()
    .notEmpty()
    .withMessage("The teacherField id teacher_field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher_field id is not valid`),
  check("startTime")
    .exists()
    .withMessage("Please add the start time for the class")
    .bail()
    .notEmpty()
    .withMessage("The start time field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("start time value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The start time must not exceed 9 digits"),
  check("groupScheduleSlot")
    .exists()
    .withMessage("Please add the group schedule slot number for this class")
    .bail()
    .notEmpty()
    .withMessage("The group schedule slot number field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("group schedule slot number value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The group schedule slot number must not exceed 9 digits"),
  check("teacherScheduleSlot")
    .exists()
    .withMessage("Please add the teacher schedule slot number for this class")
    .bail()
    .notEmpty()
    .withMessage("The teacher schedule slot number field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("teacher schedule slot number value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The teacher schedule slot number must not exceed 9 digits"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: body {school_id:[string]}
const validateGetClasses = [
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
const validateGetClass = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The class id is not valid`),
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

// @fields: params: {id:[string]},  body {school_id:[string], coordinator_id:[string], subject_id:[string], teacherField_id:[string], startTime:[number], groupScheduleSlot:[number], teacherScheduleSlot:[number]}
const validateUpdateClass = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The class id is not valid`),
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
  check("coordinator_id")
    .exists()
    .withMessage("Please add the coordinator id")
    .bail()
    .notEmpty()
    .withMessage("The coordinator id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The coordinator id is not valid`),
  check("subject_id")
    .exists()
    .withMessage("Please add the subject id")
    .bail()
    .notEmpty()
    .withMessage("The subject id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The subject id is not valid`),
  check("teacherField_id")
    .exists()
    .withMessage("Please add the teacher_field id")
    .bail()
    .notEmpty()
    .withMessage("The teacherField id teacher_field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher_field id is not valid`),
  check("startTime")
    .exists()
    .withMessage("Please add the start time for the class")
    .bail()
    .notEmpty()
    .withMessage("The start time field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("start time value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The start time must not exceed 9 digits"),
  check("groupScheduleSlot")
    .exists()
    .withMessage("Please add the group schedule slot number for this class")
    .bail()
    .notEmpty()
    .withMessage("The group schedule slot number field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("group schedule slot number value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The group schedule slot number must not exceed 9 digits"),
  check("teacherScheduleSlot")
    .exists()
    .withMessage("Please add the teacher schedule slot number for this class")
    .bail()
    .notEmpty()
    .withMessage("The teacher schedule slot number field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("teacher schedule slot number value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The teacher schedule slot number must not exceed 9 digits"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: params: {id:[string]},  body: {school_id:[string]}
const validateDeleteClass = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The class id is not valid`),
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
  validateCreateClass,
  validateGetClasses,
  validateGetClass,
  validateUpdateClass,
  validateDeleteClass,
};
