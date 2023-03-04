import { FilterQuery, isValidObjectId } from "mongoose";
import SchoolModel from "../models/schoolModel";
import TeacherModel from "../models/teacherModel";
import UserModel from "../models/userModel";

const models = {
  school: SchoolModel,
  user: UserModel,
  teacher: TeacherModel,
} as const;

// helper functions
const isValidId = (id: string) => {
  return isValidObjectId(id);
};

// CRUD operations
// @desc insert a resource in database
// @params resource, resourceName
const insertResource = <T>(resource: T, resourceName: keyof typeof models) => {
  const model = models[resourceName];
  // @ts-ignore
  const resourceInsert = model.create(resource);
  return resourceInsert;
};

// @desc find all resources of a type
// @params resourceName
const findAllResources = (
  fieldsToReturn: string,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  // @ts-ignore
  const resourceFound = model
    // @ts-ignore
    .find()
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find a resource by id
// @params resourceId, resourceName
const findResourceById = (
  resourceId: string,
  fieldsToReturn: string,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  // @ts-ignore
  const resourceFound = model
    // @ts-ignore
    .findById(resourceId)
    .select(fieldsToReturn)
    .lean()
    .exec();

  return resourceFound;
};

// @desc find a resource by name or other property
// @params resourceProperty, resourceName
const findResourceByProperty = <T>(
  resource: FilterQuery<T>,
  fieldsToReturn: string,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  const resourceFound = model
    // @ts-ignore
    .findOne(resource)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourceFound;
};

// @desc update a resource by name or other property
// @params resourceId, resource, resourceName
const updateResource = <T>(
  resourceId: string,
  resource: FilterQuery<T>,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  // @ts-ignore
  const resourceUpdated = model.findByIdAndUpdate(resourceId, resource, {
    new: true,
    runValidators: true,
  });

  return resourceUpdated;
};

// @desc delete a resource by id
// @params resourceId, resourceName
const deleteResource = (
  resourceId: string,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  const resourceDeleted = model
    .findOneAndRemove({ _id: resourceId })
    .lean()
    .exec();
  return resourceDeleted;
};

export {
  isValidId,
  insertResource,
  findAllResources,
  findResourceById,
  findResourceByProperty,
  updateResource,
  deleteResource,
};
