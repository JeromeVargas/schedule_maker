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
  hasTeachingFunc: boolean;
};

export type ContractType = "full-time" | "part-time" | "substitute";

export type Teacher = {
  user_id: Types.ObjectId;
  coordinator_id: Types.ObjectId;
  contractType: ContractType;
  hoursAssignable: number;
  hoursAssigned: number;
};
