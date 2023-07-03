import { Schema, model } from "mongoose";
import { Field } from "../typings/types";

const SchoolSchema = new Schema<Field>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide a school id for the field"],
    },
    name: {
      type: String,
      required: [true, "must provide name for the field"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SchoolModel = model<Field>("Field", SchoolSchema);

export default SchoolModel;
