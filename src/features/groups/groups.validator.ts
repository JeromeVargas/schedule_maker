import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../../lib/express-validator/validateHelper";
import { isValidId } from "../../lib/utilities/validation";

export const validateCreateGroup = [
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
  check("name")
    .exists()
    .withMessage("Please add a group name")
    .bail()
    .notEmpty()
    .withMessage("The group name field is empty")
    .bail()
    .isString()
    .withMessage("The group name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The group name must not exceed 100 characters")
    .blacklist("%,$")
    .escape()
    .trim(),
  check("numberStudents")
    .exists()
    .withMessage("Please add the group number of students")
    .bail()
    .notEmpty()
    .withMessage("The group number of students field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("group number of students value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The start time must not exceed 9 digits"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export const validateGetGroups = [
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

export const validateGetGroup = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The group id is not valid`),
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

export const validateUpdateGroup = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The group id is not valid`),
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
  check("name")
    .exists()
    .withMessage("Please add a group name")
    .bail()
    .notEmpty()
    .withMessage("The group name field is empty")
    .bail()
    .isString()
    .withMessage("The group name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The group name must not exceed 100 characters")
    .blacklist("%,$")
    .escape()
    .trim(),
  check("numberStudents")
    .exists()
    .withMessage("Please add the group number of students")
    .bail()
    .notEmpty()
    .withMessage("The group number of students field is empty")
    .bail()
    .isInt({ min: 0 })
    .withMessage("group number of students value is not valid")
    .isLength({ min: 1, max: 9 })
    .withMessage("The start time must not exceed 9 digits"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export const validateDeleteGroup = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The group id is not valid`),
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
