import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../helpers/validateHelper";
import { isValidId } from "../services/mongoServices";

const validateCreateTeacherField = [
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
  check("teacher_id")
    .exists()
    .withMessage("Please add a teacher id")
    .bail()
    .notEmpty()
    .withMessage("The teacher id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher id is not valid`),
  check("field_id")
    .exists()
    .withMessage("Please add a field id")
    .bail()
    .notEmpty()
    .withMessage("The field id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The field id is not valid`),

  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateGetTeacherFields = [
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
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

const validateGetTeacherField = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher_field id is not valid`),
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
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

const validateUpdateTeacherField = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher_field id is not valid`),
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The school id is not valid`),
  check("teacher_id")
    .exists()
    .withMessage("Please add a teacher id")
    .bail()
    .notEmpty()
    .withMessage("The teacher id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher id is not valid`),
  check("field_id")
    .exists()
    .withMessage("Please add a field id")
    .bail()
    .notEmpty()
    .withMessage("The field id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The field id is not valid`),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateDeleteTeacherField = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The teacher_field id is not valid`),
  check("school_id")
    .exists()
    .withMessage("Please add a school id")
    .bail()
    .notEmpty()
    .withMessage("The school id field is empty")
    .bail()
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
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
  validateCreateTeacherField,
  validateGetTeacherFields,
  validateGetTeacherField,
  validateUpdateTeacherField,
  validateDeleteTeacherField,
};
