import { Schema, model } from "mongoose";
import { Session } from "../../typings/types";

const SessionSchema = new Schema<Session>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a school id for the session"],
    },
    level_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a level id for the session"],
    },
    group_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a group id for the session"],
    },
    groupCoordinator_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a group_coordinator id for the session"],
    },
    teacherCoordinator_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a teacher_coordinator id for the session"],
    },
    teacherField_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a teacher_field id for the session"],
    },
    subject_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a subject id for the session"],
    },
    startTime: {
      type: Number,
      required: [true, "must provide a start time for the session"],
    },
    groupScheduleSlot: {
      type: Number,
      required: [true, "must provide a group schedule slot for the session"],
    },
    teacherScheduleSlot: {
      type: Number,
      required: [true, "must provide a group schedule slot for the session"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SessionModel = model<Session>("Session", SessionSchema);

export default SessionModel;
