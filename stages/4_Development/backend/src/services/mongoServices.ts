import { FilterQuery, isValidObjectId } from "mongoose";
import SchoolModel from "../models/schoolModel";

const models = {
  school: SchoolModel,
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
  const resourceInsert = model.create(resource);
  return resourceInsert;
};

// @desc find all resources of a type
// @params resourceName
const findAllResources = (resourceName: keyof typeof models) => {
  const model = models[resourceName];
  const resourceFound = model.find().lean().exec();
  return resourceFound;
};

// @desc find a resource by id
// @params resourceId, resourceName
const findResourceById = (
  resourceId: string,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  const resourceFound = model.findById(resourceId).lean().exec();
  return resourceFound;
};

// @desc find a resource by name or other property
// @params resourceProperty, resourceName
const findResourceByProperty = <T>(
  resource: FilterQuery<T>,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  const resourceFound = model
    .findOne(resource)
    .collation({ locale: "en", strength: 2 })
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
