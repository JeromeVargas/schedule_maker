import { Schema, model } from "mongoose";
import { Level } from "../../typings/types";

const LevelSchema = new Schema<Level>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide a school id for the level"],
    },
    schedule_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a schedule id for the level"],
    },
    name: {
      type: String,
      required: [true, "must provide name for the level"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const LevelModel = model<Level>("Level", LevelSchema);

export default LevelModel;
