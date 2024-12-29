import { Schema, model } from "mongoose";
import SessionModel from "../sessions/sessions.model";
import { TeacherCoordinator } from "../../typings/types";

const TeacherCoordinatorSchema = new Schema<TeacherCoordinator>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide name for the task"],
    },
    teacher_id: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "must provide a teacher"],
    },
    coordinator_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "must provide coordinator"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TeacherCoordinatorSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function () {
    /* get the entities ids and references */
    // get the teacher_coordinator
    const findTeacherCoordinator: TeacherCoordinator | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();

    /* update entities records in collections */
    //update the session instance/s
    await SessionModel.updateMany(
      {
        school_id: findTeacherCoordinator?.school_id,
        teacherCoordinator_id: findTeacherCoordinator?._id,
      },
      { $set: { teacherCoordinator_id: null } }
    ).exec();
  }
);

const TeacherCoordinatorModel = model<TeacherCoordinator>(
  "TeacherCoordinator",
  TeacherCoordinatorSchema
);

export default TeacherCoordinatorModel;
