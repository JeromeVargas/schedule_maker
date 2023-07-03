import { Types } from "mongoose";

export type School = {
  name: string;
  groupMaxNumStudents: number;
};

export type Role = "headmaster" | "coordinator" | "teacher";
export type Status = "active" | "inactive" | "suspended";

export type User = {
  _id?: string;
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
  user_id: Types.ObjectId;
  coordinator_id: Types.ObjectId;
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
  _id?: string;
  school_id: Types.ObjectId;
  name: string;
};

export type Teacher_Field = {
  school_id: Types.ObjectId;
  teacher_id: Types.ObjectId;
  field_id: Types.ObjectId;
};

export type Schedule = {
  _id?: string;
  school_id: Types.ObjectId;
  name: string;
  dayStart: number;
  shiftNumberMinutes: number;
  classUnitMinutes: number;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export type Break = {
  school_id: Types.ObjectId;
  schedule_id: Types.ObjectId;
  breakStart: number;
  numberMinutes: number;
};

export type Level = {
  _id?: string;
  school_id: Types.ObjectId;
  schedule_id: Types.ObjectId;
  name: string;
};

export type Group = {
  _id?: string;
  school_id: Types.ObjectId;
  level_id: Types.ObjectId;
  coordinator_id: Types.ObjectId;
  name: string;
  numberStudents: number;
};

export type Subject = {
  _id?: string;
  school_id: Types.ObjectId;
  coordinator_id: Types.ObjectId;
  group_id: Types.ObjectId;
  field_id: Types.ObjectId;
  name: string;
  classUnits: number;
  frequency: number;
};

export type Class = {
  school_id: Types.ObjectId;
  coordinator_id: Types.ObjectId;
  subject_id: Types.ObjectId;
  teacherField_id: Types.ObjectId;
  startTime: number;
  groupScheduleSlot: number;
  teacherScheduleSlot: number;
};
