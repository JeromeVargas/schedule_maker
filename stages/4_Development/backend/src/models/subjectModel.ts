import { Schema, model } from "mongoose";
import { Subject } from "../interfaces/interfaces";

const SubjectSchema = new Schema<Subject>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide a school id for the subject"],
    },
    group_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a group id for the subject"],
    },
    field_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a field id for the subject"],
    },
    name: {
      type: String,
      required: [true, "must provide name for the subject"],
    },
    classUnits: {
      type: Number,
      required: [
        true,
        "must provide the number of class units for this subject during the week",
      ],
    },
    frequency: {
      type: Number,
      required: [
        true,
        "must provide the number number of times this subject is given in a week",
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SubjectModel = model<Subject>("Subject", SubjectSchema);

export default SubjectModel;
