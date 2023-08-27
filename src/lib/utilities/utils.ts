import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";

/* helper functions */
const isValidId = (id: string) => {
  return isValidObjectId(id) && typeof id === "string";
};

const hashPwd = async (password: string) => await bcrypt.hash(password, 10); // 10 salt rounds }

export { isValidId, hashPwd };
