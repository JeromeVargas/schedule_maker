import TeacherCoordinatorModel from "./teacher_coordinators.model";
import TeacherModel from "../teachers/teachers.model";
import UserModel from "../users/users.model";
import { NewTeacher_Coordinator } from "../../typings/types";

// CRUD services
// @desc insert a teacher_field in database
// @params teacherCoordinator
export const insertTeacherCoordinator = (
  teacherCoordinator: NewTeacher_Coordinator
) => {
  return TeacherCoordinatorModel.create(teacherCoordinator);
};

// @desc find all teacher_fields by school id
// @params filters, fields to return
export const findFilterAllTeacherCoordinators = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return TeacherCoordinatorModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc find a teacher_field by teacher id, field id and school id
// @params filters, fields to return
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

// @desc find a teacher_field and filter by school_id, teacher_id and field_id
// @params filters, fields to return
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

// @desc update a teacher_field by some properties _id, school_id and teacher_id
// @params filters, teacherCoordinator
export const modifyFilterTeacherCoordinator = (
  filters: { _id: string; school_id: string; teacher_id: string },
  teacherCoordinator: NewTeacher_Coordinator
) => {
  return TeacherCoordinatorModel.findOneAndUpdate(filters, teacherCoordinator, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a teacher_field by school_id and teacher field id
// @params filters
export const removeFilterTeacherCoordinator = (filters: {
  school_id: string;
  _id: string;
}) => {
  return TeacherCoordinatorModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a teacher by id and populate the embedded entities
// @params teacherId, fields to return, fields to populate, fields to return populate
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

// @desc find a field by id and populate the embedded entities
// @params coordinatorId, fields to return, fields to populate, fields to return populate
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
