import { Types } from "mongoose";

export type School = {
  name: string;
};

export type Role = "headmaster" | "coordinator" | "teacher";
export type Status = "active" | "inactive" | "suspended";

export type User = {
  firstName: string;
  lastName: string;
  school: Types.ObjectId;
  email: string;
  password: string;
  role: Role;
  status: Status;
};
