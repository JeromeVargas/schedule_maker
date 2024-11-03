import { Request, Response } from "express";
import NotFoundError from "../errors/not-found";

export default function notFound404Middleware(req: Request, res: Response) {
  throw new NotFoundError("Route does not exist");
}
