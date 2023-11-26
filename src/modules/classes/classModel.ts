import { Schema, model } from "mongoose";
import { Class } from "../../typings/types";

const ClassSchema = new Schema<Class>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a school id for the class"],
    },
    level_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a level id for the class"],
    },
    group_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a group id for the class"],
    },
    subject_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a subject id for the class"],
    },
    teacherField_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a teacher_field id for the class"],
    },
    startTime: {
      type: Number,
      required: [true, "must provide a start time for the class"],
    },
    groupScheduleSlot: {
      type: Number,
      required: [true, "must provide a group schedule slot for the class"],
    },
    teacherScheduleSlot: {
      type: Number,
      required: [true, "must provide a group schedule slot for the class"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ClassModel = model<Class>("Class", ClassSchema);

export default ClassModel;
