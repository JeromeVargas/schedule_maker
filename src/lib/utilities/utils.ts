import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";

/* helper functions */
export const isValidId = (id: string) => {
  return isValidObjectId(id) && typeof id === "string";
};

export const hashPwd = async (password: string) =>
  await bcrypt.hash(password, 10); // 10 salt rounds }
