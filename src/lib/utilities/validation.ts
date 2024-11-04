import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";

export const isValidId = (id: string) =>
  isValidObjectId(id) && typeof id === "string";

export const hashPwd = async (password: string) =>
  await bcrypt.hash(password, 10); // 10 salt rounds
