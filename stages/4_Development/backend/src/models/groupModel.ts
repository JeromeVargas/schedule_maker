import { Schema, model } from "mongoose";
import { Group } from "../interfaces/interfaces";

const GroupSchema = new Schema<Group>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide a school id for the group"],
    },
    level_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a schedule id for the group"],
    },
    // coordinator_id: {
    //   type: Schema.Types.ObjectId,
    //   required: [true, "must provide a coordinator id for the subject"],
    // },
    name: {
      type: String,
      required: [true, "must provide name for the group"],
    },
    numberStudents: {
      type: Number,
      required: [true, "must provide a schedule id for the group"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const GroupModel = model<Group>("Group", GroupSchema);

export default GroupModel;
