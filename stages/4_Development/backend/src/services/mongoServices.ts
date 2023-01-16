import SchoolModel from "../models/schoolModel";

const models = {
  school: SchoolModel,
} as const;

// @desc insert a school in database
// @params school
const insertResource = async <T>(
  resource: T,
  resourceName: keyof typeof models
) => {
  const model = models[resourceName];
  const resourceInsert = model.create(resource);
  return resourceInsert;
};

export { insertResource };
