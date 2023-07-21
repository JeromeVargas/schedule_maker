import { Schema, model } from "mongoose";
import { Schedule } from "../../typings/types";

const ScheduleSchema = new Schema<Schedule>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "Please provide a school id"],
    },
    name: {
      type: String,
      required: [true, "Please provide a school name"],
    },
    dayStart: {
      type: Number,
      required: [true, "Please provide what the school day start time is"],
    },
    shiftNumberMinutes: {
      type: Number,
      required: [true, "Please provide the number of hours per day"],
    },
    classUnitMinutes: {
      type: Number,
      required: [true, "Please provide the number of minutes per class unit"],
    },
    monday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    tuesday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    wednesday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    thursday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    friday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    saturday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    sunday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ScheduleModel = model<Schedule>("Schedule", ScheduleSchema);

export default ScheduleModel;
