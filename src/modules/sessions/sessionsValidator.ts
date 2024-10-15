import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../../lib/helpers/validateHelper";
import { isValidId } from "../../lib/utilities/utils";

// @fields: body {school_id:[string], level_id:[string], groupCoordinator_id:[string], subject_id:[string], teacherField_id:[string], startTime:[number], groupScheduleSlot:[number], teacherScheduleSlot:[number]}
const validateCreateSession = [
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
  check("group_id")
    .exists()
    .withMessage("Please add the group id")
    .bail()
    .notEmpty()
    .withMessage("The group id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The group id is not valid`),
  check("groupCoordinator_id")
    .exists()
    .withMessage("Please add the groupCoordinator id")
    .bail()
    .notEmpty()
    .withMessage("The groupCoordinator id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The groupCoordinator id is not valid`),
  check("teacherCoordinator_id")
    .exists()
    .withMessage("Please add the teacherCoordinator id")
    .bail()
    .notEmpty()
    .withMessage("The teacherCoordinator id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacherCoordinator id is not valid`),
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
  check("startTime")
    .exists()
    .withMessage("Please add the start time for the session")
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
    .withMessage("Please add the group schedule slot number for this session")
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
    .withMessage("Please add the teacher schedule slot number for this session")
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
const validateGetSessions = [
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
const validateGetSession = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The session id is not valid`),
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

// @fields: params: {id:[string]},  body {school_id:[string], group_id:[string], subject_id:[string], subject_id:[string], teacherField_id:[string], startTime:[number], groupScheduleSlot:[number], teacherScheduleSlot:[number]}
const validateUpdateSession = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The session id is not valid`),
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
  check("group_id")
    .exists()
    .withMessage("Please add the group id")
    .bail()
    .notEmpty()
    .withMessage("The group id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The group id is not valid`),
  check("groupCoordinator_id")
    .exists()
    .withMessage("Please add the groupCoordinator id")
    .bail()
    .notEmpty()
    .withMessage("The groupCoordinator id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The groupCoordinator id is not valid`),
  check("teacherCoordinator_id")
    .exists()
    .withMessage("Please add the teacherCoordinator id")
    .bail()
    .notEmpty()
    .withMessage("The teacherCoordinator id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacherCoordinator id is not valid`),
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
  check("startTime")
    .exists()
    .withMessage("Please add the start time for the session")
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
    .withMessage("Please add the group schedule slot number for this session")
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
    .withMessage("Please add the teacher schedule slot number for this session")
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
const validateDeleteSession = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The session id is not valid`),
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
  validateCreateSession,
  validateGetSessions,
  validateGetSession,
  validateUpdateSession,
  validateDeleteSession,
};
