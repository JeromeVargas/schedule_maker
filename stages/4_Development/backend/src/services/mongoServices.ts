import { isValidObjectId } from "mongoose";
import SchoolModel from "../modules/schools/schoolModel";
import UserModel from "../modules/users/userModel";
import TeacherModel from "../modules/teachers/teacherModel";
import FieldModel from "../modules/fields/fieldModel";
import TeacherFieldModel from "../modules/teacher_fields/teacherFieldModel";
import ScheduleModel from "../modules/schedules/scheduleModel";
import BreakModel from "../modules/breaks/breakModel";
import LevelModel from "../modules/levels/levelModel";
import GroupModel from "../modules/groups/groupModel";
import SubjectModel from "../modules/subjects/subjectModel";
import ClassModel from "../modules/classes/classModel";

const models = {
  school: SchoolModel,
  user: UserModel,
  teacher: TeacherModel,
  field: FieldModel,
  teacherField: TeacherFieldModel,
  schedule: ScheduleModel,
  break: BreakModel,
  level: LevelModel,
  group: GroupModel,
  subject: SubjectModel,
  class: ClassModel,
} as const;

// helper functions
const isValidId = (id: string) => {
  return isValidObjectId(id) && typeof id === "string";
};

// CRUD services
// @desc insert a resource in database
// @params resource, resource name
const insertResource = <T>(resource: T, resourceName: keyof typeof models) => {
  // @ts-ignore
  const resourceInsert = models[resourceName].create(resource);
  return resourceInsert;
};

// @desc find all resources of a type
// @params fields to return, resource name
const findAllResources = (
  fieldsToReturn: string,
  resourceName: keyof typeof models
) => {
  // @ts-ignore
  const resourceFound = models[resourceName]
    // @ts-ignore
    .find()
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find all resources of a type based on some properties
// @params filters, fields to return, resource name
const findFilterAllResources = (
  filters: unknown,
  fieldsToReturn: string,
  resourceName: keyof typeof models
) => {
  const resourceFound = models[resourceName]
    // @ts-ignore
    .find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find a resource by id and populate the embedded
// @params filters, fields to return, fields to populate, fields to return populate, resourceName
const findPopulateFilterAllResources = (
  filters: unknown,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string,
  resourceName: keyof typeof models
) => {
  const resourceFound = models[resourceName]
    // @ts-ignore
    .find({ _id: { $in: filters } })
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find a resource by id
// @params resourceId, fields to return, resource name
const findResourceById = (
  resourceId: string,
  fieldsToReturn: string,
  resourceName: keyof typeof models
) => {
  const resourceFound = models[resourceName]
    // @ts-ignore
    .findById(resourceId)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find a resource by id and populate the embedded entities
// @params resourceId, fields to return, fields to populate, fields to return populate, resourceName
const findPopulateResourceById = (
  resourceId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string,
  resourceName: keyof typeof models
) => {
  const resourceFound = models[resourceName]
    // @ts-ignore
    .findById(resourceId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find a resource by name or other property
// @params resourceProperty, fields to return, resource name
const findResourceByProperty = (
  filters: unknown,
  fieldsToReturn: string,
  resourceName: keyof typeof models
) => {
  const resourceFound = models[resourceName]
    // @ts-ignore
    .findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find a resource and filter by some more properties
// @params resourceProperty, fields to return, resource name
const findFilterResourceByProperty = (
  filters: unknown,
  fieldsToReturn: string,
  resourceName: keyof typeof models
) => {
  const resourcesFound = models[resourceName]
    // @ts-ignore
    .find({ $and: filters })
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourcesFound;
};

// @desc update a resource by id
// @params resourceId, resource, resource name
const updateResource = <T>(
  resourceId: string,
  resource: T,
  resourceName: keyof typeof models
) => {
  // @ts-ignore
  const resourceUpdated = models[resourceName].findByIdAndUpdate(
    resourceId,
    resource,
    {
      new: true,
      runValidators: true,
    }
  );

  return resourceUpdated;
};

// @desc update a resource by some properties
// @params resourceId, resource, resource name
const updateFilterResource = <T>(
  filters: unknown,
  resource: T,
  resourceName: keyof typeof models
) => {
  // @ts-ignore
  const resourceUpdated = models[resourceName].findOneAndUpdate(
    { $and: filters },
    resource,
    {
      new: true,
      runValidators: true,
    }
  );

  return resourceUpdated;
};

// @desc delete a resource by id
// @params resourceId, resource name
const deleteResource = (
  resourceId: string,
  resourceName: keyof typeof models
) => {
  const resourceDeleted = models[resourceName]
    .findOneAndRemove({ _id: resourceId })
    .lean()
    .exec();
  return resourceDeleted;
};

// @desc delete a resource by property
// @params resourceId, filters, resource name
const deleteFilterResource = (
  filters: { _id: string; school_id: string },
  resourceName: keyof typeof models
) => {
  const resourceDeleted = models[resourceName]
    .findOneAndDelete(filters)
    .lean()
    .exec();
  return resourceDeleted;
};

export {
  isValidId,
  insertResource,
  findAllResources,
  findFilterAllResources,
  findPopulateFilterAllResources,
  findResourceById,
  findPopulateResourceById,
  findResourceByProperty,
  findFilterResourceByProperty,
  updateResource,
  updateFilterResource,
  deleteResource,
  deleteFilterResource,
};
