import { Schema, model } from "mongoose";
import { User } from "../../typings/types";
import TeacherModel from "../teachers/teacherModel";
import TeacherFieldModel from "../teacher_fields/teacherFieldModel";

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
    },
    password: {
      type: String,
      required: [true, "Please provide a password for the user"],
    },
    role: {
      type: String,
      enum: ["headmaster", "coordinator", "teacher"],
      required: [true, "Please provide a role for the user"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      required: [true, "Please provide a status for the user"],
    },
    hasTeachingFunc: {
      type: Boolean,
      required: [true, "Please confirm the user has teaching functions"],
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
    // get the user
    const findUser: User | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();
    // delete the teacher instance
    const deleteTeacher = await TeacherModel.findOneAndDelete({
      school_id: findUser?.school_id,
      user_id: findUser?._id,
    })
      .select("school_id teacher_id")
      .exec();
    // delete the teacher_fields instance/s
    const deleteTeacherField = await TeacherFieldModel.deleteMany({
      school_id: deleteTeacher?.school_id,
      teacher_id: deleteTeacher?._id,
    }).exec();
    console.log(deleteTeacherField);
  }
);

const UserModel = model<User>("User", UserSchema);

export default UserModel;
