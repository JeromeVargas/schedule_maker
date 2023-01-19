import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../helpers/validateHelper";

const validateCreate = [
  check("name")
    .exists()
    .withMessage("Please add a name")
    .bail()
    .notEmpty()
    .withMessage("The name field is empty")
    .bail()
    .isString()
    .withMessage("The name is not valid")
    .isLength({ min: 1, max: 100 })
    .withMessage("The name must not exceed 100 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export { validateCreate };
