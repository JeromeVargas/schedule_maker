import { isValidObjectId } from "mongoose";

/* helper functions */
const isValidId = (id: string) => {
  return isValidObjectId(id) && typeof id === "string";
};

export { isValidId };
