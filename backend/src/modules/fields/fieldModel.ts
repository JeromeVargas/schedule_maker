import { Schema, model } from "mongoose";
import { Field } from "../../typings/types";

const FieldSchema = new Schema<Field>(
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

const FieldModel = model<Field>("Field", FieldSchema);

export default FieldModel;
