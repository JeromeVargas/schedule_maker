import { Schema, model } from "mongoose";
import { Group } from "../typings/types";

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
    coordinator_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "must provide a coordinator id for the group"],
    },
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
