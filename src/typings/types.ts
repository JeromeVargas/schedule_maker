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
export type UserStatus = "active" | "inactive" | "on_leave";

export type User = {
  _id: Types.ObjectId;
  school_id: School;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
};

export type NewUser = Omit<User, "_id">;

// teacher
export type ContractType = "full-time" | "part-time" | "substitute";

export type Teacher = {
  _id: Types.ObjectId;
  school_id: School;
  user_id: User;
  coordinator_id: User;
  contractType: ContractType;
  teachingHoursAssignable: number;
  teachingHoursAssigned: number;
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
  school_id: School;
  name: string;
};

export type NewField = Omit<Field, "_id">;

// teacher_field
export type Teacher_Field = {
  _id: Types.ObjectId;
  school_id: School;
  teacher_id: Teacher;
  field_id: Field;
};

export type NewTeacher_Field = Omit<Teacher_Field, "_id">;

// schedule
export type Schedule = {
  _id: Types.ObjectId;
  school_id: School;
  name: string;
  dayStart: number;
  shiftNumberMinutes: number;
  sessionUnitMinutes: number;
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
  school_id: School;
  schedule_id: Schedule;
  breakStart: number;
  numberMinutes: number;
};

export type NewBreak = Omit<Break, "_id">;

// level
export type Level = {
  _id: Types.ObjectId;
  school_id: School;
  schedule_id: Schedule;
  name: string;
};

export type NewLevel = Omit<Level, "_id">;

// group
export type Group = {
  _id: Types.ObjectId;
  school_id: School;
  level_id: Level;
  coordinator_id: User;
  name: string;
  numberStudents: number;
};

export type NewGroup = Omit<Group, "_id">;

// subject
export type Subject = {
  _id: Types.ObjectId;
  school_id: School;
  level_id: Level;
  field_id: Field;
  name: string;
  sessionUnits: number;
  frequency: number;
};

export type NewSubject = Omit<Subject, "_id">;

// session
export type Session = {
  _id: Types.ObjectId;
  school_id: School;
  level_id: Level;
  group_id: Group;
  subject_id: Group;
  teacherField_id: Teacher_Field;
  startTime: number;
  groupScheduleSlot: number;
  teacherScheduleSlot: number;
};

export type NewSession = Omit<Session, "_id">;
