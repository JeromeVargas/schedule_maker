import { Schema, model } from "mongoose";
import { Level } from "../interfaces/interfaces";

const LevelSchema = new Schema<Level>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a school id for the break"],
    },
    schedule_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a schedule id for the break"],
    },
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

const LevelModel = model<Level>("Level", LevelSchema);

export default LevelModel;
