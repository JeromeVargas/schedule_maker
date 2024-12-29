import TeacherCoordinatorModel from "./teacher_coordinators.model";
import TeacherModel from "../teachers/teachers.model";
import UserModel from "../users/users.model";
import {
  NewSchool,
  NewTeacher,
  NewTeacherCoordinator,
  NewUser,
} from "../../typings/types";
import SchoolModel from "../schools/schools.model";

/* TeacherCoordinators */
export const insertTeacherCoordinator = (
  teacherCoordinator: NewTeacherCoordinator
) => {
  return TeacherCoordinatorModel.create(teacherCoordinator);
};

export const insertManyTeacherCoordinators = (
  teacherCoordinators: NewTeacherCoordinator[]
) => {
  return TeacherCoordinatorModel.insertMany(teacherCoordinators);
};

export const findFilterAllTeacherCoordinators = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return TeacherCoordinatorModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const findTeacherCoordinatorByProperty = (
  filters:
    | { school_id: string; teacher_id: string; coordinator_id: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return TeacherCoordinatorModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const findFilterTeacherCoordinatorByProperty = (
  filters: { school_id: string; teacher_id: string; field_id: string },
  fieldsToReturn: string
) => {
  return TeacherCoordinatorModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const modifyFilterTeacherCoordinator = (
  filters: { _id: string; school_id: string; teacher_id: string },
  teacherCoordinator: NewTeacherCoordinator
) => {
  return TeacherCoordinatorModel.findOneAndUpdate(filters, teacherCoordinator, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterTeacherCoordinator = (filters: {
  school_id: string;
  _id: string;
}) => {
  return TeacherCoordinatorModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllTeacherCoordinators = () => {
  return TeacherCoordinatorModel.deleteMany();
};

/* Schools */
export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};

/* Teachers */
export const insertTeacher = (teacher: NewTeacher) => {
  const teacherInsert = TeacherModel.create(teacher);
  return teacherInsert;
};

export const findPopulateTeacherById = (
  teacherId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return TeacherModel.findById(teacherId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

export const removeAllTeachers = () => {
  return TeacherModel.deleteMany();
};

/* Users */
export const insertUser = (user: NewUser) => {
  return UserModel.create(user);
};

export const removeAllUsers = () => {
  return UserModel.deleteMany();
};

export const findPopulateCoordinatorById = (
  coordinatorId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return UserModel.findById(coordinatorId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};
