import { Schema, model } from "mongoose";
import { School } from "../interfaces/schoolInterface";

const SchoolSchema = new Schema<School>(
  {
    name: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SchoolModel = model("school", SchoolSchema);

export default SchoolModel;
