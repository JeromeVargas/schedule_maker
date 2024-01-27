import { Schema, model } from "mongoose";
import SessionModel from "../sessions/sessionModel";
import { Teacher_Coordinator } from "../../typings/types";

const TeacherCoordinatorSchema = new Schema<Teacher_Coordinator>(
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
    const findTeacherCoordinator: Teacher_Coordinator | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();
    /* delete entities records in collections */
    // delete the session instance/s
    await SessionModel.updateMany(
      {
        school_id: findTeacherCoordinator?.school_id,
        teacherCoordinator_id: findTeacherCoordinator?._id,
      },
      { $set: { teacherCoordinator_id: null } }
    ).exec();
  }
);

const TeacherCoordinatorModel = model<Teacher_Coordinator>(
  "Teacher_Coordinator",
  TeacherCoordinatorSchema
);

export default TeacherCoordinatorModel;
