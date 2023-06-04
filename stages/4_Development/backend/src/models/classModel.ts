import { Schema, model } from "mongoose";
import { Class } from "../interfaces/interfaces";

const ClassSchema = new Schema<Class>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide a school id for the class"],
    },
    subject_id: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "must provide a school id for the class"],
    },
    teacherField_id: {
      type: Schema.Types.ObjectId,
      ref: "TeacherField",
      required: [true, "must provide a school id for the class"],
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
