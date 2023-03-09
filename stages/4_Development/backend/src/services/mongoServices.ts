import { isValidObjectId } from "mongoose";
import SchoolModel from "../models/schoolModel";
import TeacherModel from "../models/teacherModel";
import UserModel from "../models/userModel";
import FieldModel from "../models/fieldModel";

const models = {
  school: SchoolModel,
  user: UserModel,
  teacher: TeacherModel,
  field: FieldModel,
} as const;

// helper functions
const isValidId = (id: string) => {
  return isValidObjectId(id);
};

// CRUD services
// @desc insert a resource in database
// @params resource, resourceName
const insertResource = <T>(resource: T, resourceName: keyof typeof models) => {
  const model = models[resourceName];
  // @ts-ignore
  const resourceInsert = model.create(resource);
  return resourceInsert;
};

// @desc find all resources of a type
// @params fields to return, resourceName
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

// @desc find all resources of a type based on some properties
// @params filters, fields to return, resourceName
const findFilterAllResources = (
  filters: unknown,
  fieldsToReturn: string,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  // @ts-ignore
  const resourceFound = model
    // @ts-ignore
    .find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find a resource by id
// @params resourceId, fields to return, resourceName
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
// @params resourceProperty, fields to return, resourceName
const findResourceByProperty = (
  filters: unknown,
  fieldsToReturn: string,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  const resourceFound = model
    // @ts-ignore
    .findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find a resource and filter by some more properties
// @params resourceProperty, fields to return, resourceName
const findFilterResourceByProperty = (
  filters: unknown,
  fieldsToReturn: string,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  const resourcesFound = model
    // @ts-ignore
    .find({ $and: filters })
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourcesFound;
};

// @desc update a resource by id
// @params resourceId, resource, resourceName
const updateResource = <T>(
  resourceId: string,
  resource: T,
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

// @desc update a resource by some properties
// @params resourceId, resource, resourceName
const updateFilterResource = <T>(
  filters: unknown,
  resource: T,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  // @ts-ignore
  const resourceUpdated = model.findOneAndUpdate({ $and: filters }, resource, {
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

// @desc delete a resource by property
// @params resourceId, filters, resourceName
const deleteFilterResource = (
  filters: any,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  const resourceDeleted = model.findOneAndDelete(filters).lean().exec();
  return resourceDeleted;
};

export {
  isValidId,
  insertResource,
  findAllResources,
  findFilterAllResources,
  findResourceById,
  findResourceByProperty,
  findFilterResourceByProperty,
  updateResource,
  updateFilterResource,
  deleteResource,
  deleteFilterResource,
};
