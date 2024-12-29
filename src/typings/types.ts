// School
export type SchoolStatus = "active" | "inactive";
export type School = {
  _id: string;
  name: string;
  groupMaxNumStudents: number;
  status: SchoolStatus;
};

export type NewSchool = Omit<School, "_id">;

// User
export type UserRole = "headmaster" | "coordinator" | "teacher";
export type UserStatus = "active" | "inactive" | "leave";

export type User = {
  _id: string;
  school_id: School;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

export type NewUser = {
  school_id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

// Teacher
export type ContractType = "full-time" | "part-time" | "substitute";

export type Teacher = {
  _id: string;
  school_id: School;
  user_id: User;
  contractType: ContractType;
  teachingHoursAssignable: number;
  teachingHoursAssigned: number;
  adminHoursAssignable: number;
  adminHoursAssigned: number;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export type NewTeacher = {
  school_id: string;
  user_id: string;
  contractType: ContractType;
  teachingHoursAssignable: number;
  teachingHoursAssigned: number;
  adminHoursAssignable: number;
  adminHoursAssigned: number;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

// Field
export type Field = {
  _id: string;
  school_id: School;
  name: string;
};

export type NewField = {
  school_id: string;
  name: string;
};

// TeacherField
export type TeacherField = {
  _id: string;
  school_id: School;
  teacher_id: Teacher;
  field_id: Field;
};

export type NewTeacherField = {
  school_id: string;
  teacher_id: string;
  field_id: string;
};

// Schedule
export type Schedule = {
  _id: string;
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

export type NewSchedule = {
  school_id: string;
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

// Break
export type Break = {
  _id: string;
  school_id: School;
  schedule_id: Schedule;
  breakStart: number;
  numberMinutes: number;
};

export type NewBreak = {
  school_id: string;
  schedule_id: string;
  breakStart: number;
  numberMinutes: number;
};

// Level
export type Level = {
  _id: string;
  school_id: School;
  schedule_id: Schedule;
  name: string;
};

export type NewLevel = {
  school_id: string;
  schedule_id: string;
  name: string;
};

// Group
export type Group = {
  _id: string;
  school_id: School;
  level_id: Level;
  name: string;
  numberStudents: number;
};

export type NewGroup = {
  school_id: string;
  level_id: string;
  name: string;
  numberStudents: number;
};

// GroupCoordinator
export type GroupCoordinator = {
  _id: string;
  school_id: School;
  group_id: Group;
  coordinator_id: User;
};

export type NewGroupCoordinator = {
  school_id: string;
  group_id: string;
  coordinator_id: string;
};

// Subject
export type Subject = {
  _id: string;
  school_id: School;
  level_id: Level;
  field_id: Field;
  name: string;
  sessionUnits: number;
  frequency: number;
};

export type NewSubject = {
  school_id: string;
  level_id: string;
  field_id: string;
  name: string;
  sessionUnits: number;
  frequency: number;
};

// TeacherCoordinator
export type TeacherCoordinator = {
  _id: string;
  school_id: School;
  teacher_id: Teacher;
  coordinator_id: User;
};

export type NewTeacherCoordinator = {
  school_id: string;
  teacher_id: string;
  coordinator_id: string;
};

// Session
export type Session = {
  _id: string;
  school_id: School;
  level_id: Level;
  group_id: Group;
  groupCoordinator_id: GroupCoordinator;
  teacherCoordinator_id: TeacherCoordinator;
  teacherField_id: TeacherField;
  subject_id: Group;
  startTime: number;
  groupScheduleSlot: number;
  teacherScheduleSlot: number;
};

export type NewSession = {
  school_id: string;
  level_id: string;
  group_id: string;
  groupCoordinator_id: string;
  teacherCoordinator_id: string;
  teacherField_id: string;
  subject_id: string;
  startTime: number;
  groupScheduleSlot: number;
  teacherScheduleSlot: number;
};
