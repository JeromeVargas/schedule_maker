import { isValidObjectId } from "mongoose";
import SchoolModel from "../models/schoolModel";
import UserModel from "../models/userModel";
import TeacherModel from "../models/teacherModel";
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
// @params resource, resource name
const insertResource = <T>(resource: T, resourceName: keyof typeof models) => {
  const model = models[resourceName];
  // @ts-ignore
  const resourceInsert = model.create(resource);
  return resourceInsert;
};

// @desc find all resources of a type
// @params fields to return, resource name
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
// @params filters, fields to return, resource name
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

// @desc find a resource by id and populate the embedded
// @params filters, fields to return, fields to populate, fields to return populate, resourceName
const findPopulateFilterAllResources = (
  filters: unknown,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  // @ts-ignore
  const resourceFound = model
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

// @desc find a resource by id and populate the embedded
// @params resourceId, fields to return, fields to populate, fields to return populate, resourceName
const findPopulateResourceById = (
  resourceId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  // @ts-ignore
  const resourceFound = model
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
// @params resourceProperty, fields to return, resource name
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
// @params resourceId, resource, resource name
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
// @params resourceId, resource, resource name
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
// @params resourceId, resource name
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
// @params resourceId, filters, resource name
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
