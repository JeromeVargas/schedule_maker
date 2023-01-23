import { Request, Response } from "express";
import NotFoundError from "../errors/not-found";

const notFound404Middleware = (req: Request, res: Response) => {
  throw new NotFoundError("Route does not exist");
};

export default notFound404Middleware;
