import CustomAPIError from "./custom-error";
import { StatusCodes } from "http-status-codes";

export default class ConflictError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}
