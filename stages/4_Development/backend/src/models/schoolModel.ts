import { Schema, model } from "mongoose";
import { School } from "../interfaces/interfaces";

const SchoolSchema = new Schema<School>(
  {
    name: {
      type: String,
      required: [true, "must provide name for the task"],
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SchoolModel = model<School>("School", SchoolSchema);

export default SchoolModel;
