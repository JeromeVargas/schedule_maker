import { NewSchool, NewUser } from "../../typings/types";
import SchoolModel from "../schools/schools.model";
import UserModel from "./users.model";

/* Users */
export const insertUser = (user: NewUser) => {
  return UserModel.create(user);
};

export const insertManyUsers = (users: NewUser[]) => {
  return UserModel.insertMany(users);
};

export const findAllUsers = (fieldsToReturn: string) => {
  return UserModel.find().select(fieldsToReturn).lean().exec();
};

export const findFilterAllUsers = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return UserModel.find(filters).select(fieldsToReturn).lean().exec();
};

export const findUserByProperty = (
  filters:
    | { school_id: string; email: string }
    | { school_id: string; _id: string }
    | { email: string },
  fieldsToReturn: string
) => {
  return UserModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const modifyFilterUser = (
  filters: {
    school_id: string;
    _id: string;
  },
  user: NewUser
) => {
  return UserModel.findOneAndUpdate(filters, user, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterUser = (filters: {
  school_id: string;
  _id: string;
}) => {
  return UserModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllUsers = () => {
  return UserModel.deleteMany();
};

/* School */
export const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  return SchoolModel.findById(schoolId).select(fieldsToReturn).lean().exec();
};

export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};
