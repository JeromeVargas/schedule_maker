import CustomAPIError from "./custom-error";
import { StatusCodes } from "http-status-codes";

export default class NotFoundError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
