import { Schema, model } from "mongoose";
import { Schedule } from "../../typings/types";
import BreakModel from "../breaks/breaks.model";
import LevelModel from "../levels/levels.model";

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
    sessionUnitMinutes: {
      type: Number,
      required: [true, "Please provide the number of minutes per session unit"],
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

ScheduleSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function () {
    /* get the entities ids and references */
    // get the schedule
    const findSchedule: Schedule | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();

    /* delete entities records in collections */
    // delete the break instance/s
    await BreakModel.deleteMany({
      school_id: findSchedule?.school_id,
      schedule_id: findSchedule?._id,
    }).exec();
  }
);

const ScheduleModel = model<Schedule>("Schedule", ScheduleSchema);

export default ScheduleModel;
