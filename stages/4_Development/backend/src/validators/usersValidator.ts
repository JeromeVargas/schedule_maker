import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../helpers/validateHelper";
import { isValidId } from "../services/mongoServices";

const validateCreateUser = [
  check("school_id")
    .exists()
    .withMessage("Please add the user's school id")
    .bail()
    .notEmpty()
    .withMessage("The school field is empty")
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
  check("firstName")
    .exists()
    .withMessage("Please add the user's first name")
    .bail()
    .notEmpty()
    .withMessage("The first name field is empty")
    .bail()
    .isString()
    .withMessage("The first name is not valid")
    .isLength({ min: 1, max: 50 })
    .withMessage("The first name must not exceed 50 characters"),
  check("lastName")
    .exists()
    .withMessage("Please add the user's last name")
    .bail()
    .notEmpty()
    .withMessage("The last name field is empty")
    .bail()
    .isString()
    .withMessage("The last name is not valid")
    .isLength({ min: 1, max: 50 })
    .withMessage("The last name must not exceed 50 characters"),
  check("email")
    .exists()
    .withMessage("Please add the user's email")
    .bail()
    .notEmpty()
    .withMessage("The email field is empty")
    .bail()
    .isString()
    .withMessage("email is not valid")
    .bail()
    .isEmail()
    .withMessage("please add a correct email address")
    .isLength({ min: 1, max: 50 })
    .withMessage("The email must not exceed 50 characters"),
  check("password")
    .exists()
    .withMessage("Please add the user's password")
    .bail()
    .notEmpty()
    .withMessage("The password field is empty")
    .bail()
    .isString()
    .withMessage("The password is not valid")
    .isLength({ min: 8 })
    .withMessage("The password must be at least 8 characters long"),
  check("role")
    .exists()
    .withMessage("Please add the user's role")
    .bail()
    .notEmpty()
    .withMessage("The role field is empty")
    .bail()
    .isString()
    .withMessage("role is not valid")
    .bail()
    .isIn(["headmaster", "coordinator", "teacher"])
    .withMessage("the role provided is not a valid option"),
  check("status")
    .exists()
    .withMessage("Please add the user's current status")
    .bail()
    .notEmpty()
    .withMessage("The status field is empty")
    .bail()
    .isString()
    .withMessage("status is not valid")
    .bail()
    .isIn(["active", "inactive", "suspended"])
    .withMessage("the status provided is not a valid option"),
  check("hasTeachingFunc")
    .exists()
    .withMessage("Please add if the user has teaching functions assigned")
    .bail()
    .notEmpty()
    .withMessage("The hasTeachingFunc field is empty")
    .bail()
    .isBoolean()
    .withMessage("hasTeachingFunc value is not valid"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateGetUsers = [
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

const validateGetUser = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The user id is not valid`),
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

const validateUpdateUser = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The user id is not valid`),
  check("school_id")
    .exists()
    .withMessage("Please add the user's school id")
    .bail()
    .notEmpty()
    .withMessage("The school field is empty")
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
  check("firstName")
    .exists()
    .withMessage("Please add the user's first name")
    .bail()
    .notEmpty()
    .withMessage("The first name field is empty")
    .bail()
    .isString()
    .withMessage("The first name is not valid")
    .isLength({ min: 1, max: 50 })
    .withMessage("The first name must not exceed 50 characters"),
  check("lastName")
    .exists()
    .withMessage("Please add the user's last name")
    .bail()
    .notEmpty()
    .withMessage("The last name field is empty")
    .bail()
    .isString()
    .withMessage("The last name is not valid")
    .isLength({ min: 1, max: 50 })
    .withMessage("The last name must not exceed 50 characters"),
  check("email")
    .exists()
    .withMessage("Please add the user's email")
    .bail()
    .notEmpty()
    .withMessage("The email field is empty")
    .bail()
    .isString()
    .withMessage("email is not valid")
    .bail()
    .isEmail()
    .withMessage("please add a correct email address")
    .isLength({ min: 1, max: 50 })
    .withMessage("The email must not exceed 50 characters"),
  check("password")
    .exists()
    .withMessage("Please add the user's password")
    .bail()
    .notEmpty()
    .withMessage("The password field is empty")
    .bail()
    .isString()
    .withMessage("The password is not valid")
    .isLength({ min: 8 })
    .withMessage("The password must be at least 8 characters long"),
  check("role")
    .exists()
    .withMessage("Please add the user's role")
    .bail()
    .notEmpty()
    .withMessage("The role field is empty")
    .bail()
    .isString()
    .withMessage("role is not valid")
    .bail()
    .isIn(["headmaster", "coordinator", "teacher"])
    .withMessage("the role provided is not a valid option"),
  check("status")
    .exists()
    .withMessage("Please add the user's current status")
    .bail()
    .notEmpty()
    .withMessage("The status field is empty")
    .bail()
    .isString()
    .withMessage("status is not valid")
    .bail()
    .isIn(["active", "inactive", "suspended"])
    .withMessage("the status provided is not a valid option"),
  check("hasTeachingFunc")
    .exists()
    .withMessage("Please add if the user has teaching functions assigned")
    .bail()
    .notEmpty()
    .withMessage("The hasTeachingFunc field is empty")
    .bail()
    .isBoolean()
    .withMessage("hasTeachingFunc value is not valid")
    .bail(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

const validateDeleteUser = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false || typeof value !== "string") {
        return false;
      } else if (validId === true) {
        return true;
      }
    })
    .withMessage(`The user id is not valid`),
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
  validateCreateUser,
  validateGetUsers,
  validateGetUser,
  validateUpdateUser,
  validateDeleteUser,
};
