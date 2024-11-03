import { StatusCodes } from "http-status-codes";

export default class CustomAPIError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
