import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../../lib/helpers/validateHelper";
import { isValidId } from "../../lib/utilities/utils";

// @fields: body: {school_id:[string], firstName:[string], lastName:[string], email:[string], password:[string], role:[string], status:[string]}
export const validateCreateUser = [
  check("school_id")
    .exists()
    .withMessage("Please add the user's school id")
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
    .withMessage("The first name must not exceed 50 characters")
    .blacklist("%,$")
    .trim()
    .escape(),
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
    .withMessage("The last name must not exceed 50 characters")
    .blacklist("%,$")
    .trim()
    .escape(),
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
    .withMessage("The email must not exceed 50 characters")
    .blacklist("%,$")
    .trim()
    .escape(),
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
    .withMessage("The password must be at least 8 characters long")
    .isLength({ max: 128 })
    .withMessage("The password must not exceed 128 characters")
    .trim(),
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
    .withMessage("the role provided is not a valid option")
    .blacklist("%,$")
    .trim()
    .escape(),
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
    .isIn(["active", "inactive", "on_leave"])
    .withMessage("the status provided is not a valid option")
    .blacklist("%,$")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: body: {school_id:[string]}
export const validateGetUsers = [
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
export const validateGetUser = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
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

// @fields: params: {id:[string]},  body: {school_id:[string], firstName:[string], lastName:[string], email:[string], password:[string], role:[string], status:[string]}
export const validateUpdateUser = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
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
      if (validId === false) {
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
    .withMessage("The first name must not exceed 50 characters")
    .blacklist("%,$")
    .trim()
    .escape(),
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
    .withMessage("The last name must not exceed 50 characters")
    .blacklist("%,$")
    .trim()
    .escape(),
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
    .withMessage("The email must not exceed 50 characters")
    .blacklist("%,$")
    .trim()
    .escape(),
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
    .withMessage("The password must be at least 8 characters long")
    .isLength({ max: 128 })
    .withMessage("The password must not exceed 128 characters")
    .trim(),
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
    .withMessage("the role provided is not a valid option")
    .blacklist("%,$")
    .trim()
    .escape(),
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
    .isIn(["active", "inactive", "on_leave"])
    .withMessage("the status provided is not a valid option")
    .blacklist("%,$")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

// @fields: params: {id:[string]},  body: {school_id:[string]}
export const validateDeleteUser = [
  check("id")
    .custom((value) => {
      const validId = isValidId(value);
      if (validId === false) {
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
