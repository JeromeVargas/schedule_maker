import { Schema, model } from "mongoose";
import { Break } from "../interfaces/interfaces";

const BreakSchema = new Schema<Break>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a school id for the break"],
    },
    schedule_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a schedule id for the break"],
    },
    breakStart: {
      type: Number,
      required: [true, "must provide a schedule id for the break"],
    },
    numberMinutes: {
      type: Number,
      required: [true, "must provide a schedule id for the break"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BreakModel = model<Break>("Break", BreakSchema);

export default BreakModel;
