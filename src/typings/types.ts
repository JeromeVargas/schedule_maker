import { Types } from "mongoose";

// school
export type SchoolStatus = "active" | "inactive";
export type School = {
  _id: Types.ObjectId;
  name: string;
  groupMaxNumStudents: number;
  status: School;
};

export type NewSchool = Omit<School, "_id">;

// User
export type Role = "headmaster" | "coordinator" | "teacher";
export type Status = "active" | "inactive" | "on_leave";

export type User = {
  _id: Types.ObjectId;
  school_id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  status: Status;
  hasTeachingFunc: boolean;
};

export type NewUser = Omit<User, "_id">;

// teacher
export type ContractType = "full-time" | "part-time" | "substitute";

export type Teacher = {
  _id: Types.ObjectId;
  school_id: Types.ObjectId;
  user_id: User;
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

export type NewTeacher = Omit<Teacher, "_id">;

// field
export type Field = {
  _id: Types.ObjectId;
  school_id: Types.ObjectId;
  name: string;
};

export type NewField = Omit<Field, "_id">;

// teacher_field
export type Teacher_Field = {
  _id: Types.ObjectId;
  school_id: Types.ObjectId;
  teacher_id: Teacher;
  field_id: Types.ObjectId;
};

export type NewTeacher_Field = Omit<Teacher_Field, "_id">;

// schedule
export type Schedule = {
  _id: Types.ObjectId;
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

export type NewSchedule = Omit<Schedule, "_id">;

// break
export type Break = {
  _id: Types.ObjectId;
  school_id: Types.ObjectId;
  schedule_id: Types.ObjectId;
  breakStart: number;
  numberMinutes: number;
};

export type NewBreak = Omit<Break, "_id">;

// level
export type Level = {
  _id: Types.ObjectId;
  school_id: School;
  schedule_id: Types.ObjectId;
  name: string;
};

export type NewLevel = Omit<Level, "_id">;

// group
export type Group = {
  _id: Types.ObjectId;
  school_id: Types.ObjectId;
  level_id: Types.ObjectId;
  coordinator_id: User;
  name: string;
  numberStudents: number;
};

export type NewGroup = Omit<Group, "_id">;

// subject
export type Subject = {
  _id: Types.ObjectId;
  school_id: Types.ObjectId;
  level_id: Types.ObjectId;
  field_id: Types.ObjectId;
  name: string;
  classUnits: number;
  frequency: number;
};

export type NewSubject = Omit<Subject, "_id">;

// class
export type Class = {
  _id: Types.ObjectId;
  school_id: Types.ObjectId;
  level_id: Types.ObjectId;
  group_id: Types.ObjectId;
  subject_id: Types.ObjectId;
  teacherField_id: Types.ObjectId;
  startTime: number;
  groupScheduleSlot: number;
  teacherScheduleSlot: number;
};

export type NewClass = Omit<Class, "_id">;
