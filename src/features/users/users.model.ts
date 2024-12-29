import { Schema, model } from "mongoose";
import {
  GroupCoordinator,
  TeacherCoordinator,
  TeacherField,
  User,
} from "../../typings/types";
import TeacherModel from "../teachers/teachers.model";
import TeacherFieldModel from "../teacher_fields/teacher_fields.model";
import TeacherCoordinatorModel from "../teacher_coordinators/teacher_coordinators.model";
import GroupCoordinatorModel from "../group_coordinators/group_coordinators.model";
import SessionModel from "../sessions/sessions.model";

const UserSchema = new Schema<User>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "Please provide a school name"],
    },
    firstName: {
      type: String,
      required: [true, "Please provide a first name for the user"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name for the user"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email for the user"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password for the user"],
    },
    role: {
      type: String,
      enum: ["headmaster", "coordinator", "teacher", "student"],
      required: [true, "Please provide a role for the user"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "leave"],
      required: [true, "Please provide a status for the user"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function () {
    /* get the entities ids and references */
    // get the user
    const findUser: User | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();
    // get the teacher
    const findTeacher = await TeacherModel.findOne({
      school_id: findUser?.school_id,
      user_id: findUser?._id,
    })
      .select("_id school_id")
      .lean()
      .exec();
    // get the teacher_coordinators
    const findGroupCoordinators: GroupCoordinator[] =
      await GroupCoordinatorModel.find({
        school_id: findUser?.school_id,
        coordinator_id: findUser?._id,
      })
        .select("_id")
        .lean()
        .exec();
    // get the teacher_coordinators
    const findTeacherCoordinators_teachers: TeacherCoordinator[] =
      await TeacherCoordinatorModel.find({
        school_id: findTeacher?.school_id,
        teacher_id: findTeacher?._id,
      })
        .select("_id")
        .lean()
        .exec();
    const findTeacherCoordinators_coordinators: TeacherCoordinator[] =
      await TeacherCoordinatorModel.find({
        school_id: findUser?.school_id,
        coordinator_id: findUser?._id,
      })
        .select("_id")
        .lean()
        .exec();
    // get the teacher_fields
    const findTeacherFields: TeacherField[] = await TeacherFieldModel.find({
      school_id: findUser?.school_id,
      teacher_id: findTeacher?._id,
    })
      .select("_id")
      .lean()
      .exec();

    /* delete entities records in collections */
    // delete the teacher instance
    const deleteTeacher = await TeacherModel.findOneAndDelete({
      school_id: findUser?.school_id,
      user_id: findUser?._id,
    })
      .select("school_id teacher_id")
      .exec();
    // delete the teacher_fields instance/s
    await TeacherFieldModel.deleteMany({
      school_id: deleteTeacher?.school_id,
      teacher_id: deleteTeacher?._id,
    }).exec();
    // delete the teacher_coordinators instance/s
    await TeacherCoordinatorModel.deleteMany({
      school_id: deleteTeacher?.school_id,
      teacher_id: deleteTeacher?._id,
    }).exec();
    await TeacherCoordinatorModel.deleteMany({
      school_id: findUser?.school_id,
      coordinator_id: findUser?._id,
    }).exec();
    // delete the group_coordinators instance/s
    await GroupCoordinatorModel.deleteMany({
      school_id: findUser?.school_id,
      coordinator_id: findUser?._id,
    }).exec();

    /* update entities records in collections */
    // update the session instance/s
    await SessionModel.updateMany(
      { groupCoordinator_id: { $in: findGroupCoordinators } },
      { groupCoordinator_id: null }
    );
    await SessionModel.updateMany(
      { teacherCoordinator_id: { $in: findTeacherCoordinators_teachers } },
      { teacherCoordinator_id: null }
    );
    await SessionModel.updateMany(
      { teacherCoordinator_id: { $in: findTeacherCoordinators_coordinators } },
      { teacherCoordinator_id: null }
    );
    await SessionModel.updateMany(
      { teacherField_id: { $in: findTeacherFields } },
      { teacherField_id: null }
    );
  }
);

const UserModel = model<User>("User", UserSchema);

export default UserModel;
