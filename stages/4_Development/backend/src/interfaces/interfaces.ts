import { Types } from "mongoose";

export type School = {
  name: string;
};

export type Role = "headmaster" | "coordinator" | "teacher";
export type Status = "active" | "inactive" | "suspended";

export type User = {
  school_id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  status: Status;
  hasTeachingFunc: boolean;
};

export type ContractType = "full-time" | "part-time" | "substitute";

export type Teacher = {
  school_id: Types.ObjectId;
  coordinator_id: Types.ObjectId;
  user_id: Types.ObjectId;
  contractType: ContractType;
  hoursAssignable: number;
  hoursAssigned: number;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export type Field = {
  school_id: Types.ObjectId;
  name: string;
};

export type Teacher_Field = {
  school_id: Types.ObjectId;
  teacher_id: Types.ObjectId;
  field_id: Types.ObjectId;
};

export type Schedule = {
  school_id: Types.ObjectId;
  day_start: Number;
  number_hours: Number;
  class_unit_length: ContractType;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};
