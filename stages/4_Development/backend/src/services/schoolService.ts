import { School } from "../interfaces/schoolInterface";

import SchoolModel from "../models/schoolModel";

// @desc insert a school in database
// @params school
const insertSchool = (school: School) => {
  const responseInsert = SchoolModel.create(school);
  return responseInsert;
};

export { insertSchool };
