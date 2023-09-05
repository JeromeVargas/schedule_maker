import { Schema, model } from "mongoose";
import { Teacher } from "../../typings/types";
import TeacherFieldModel from "../teacher_fields/teacherFieldModel";

const TeacherSchema = new Schema<Teacher>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "Please provide a school name"],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: [true, "Please provide the user's id"],
    },
    coordinator_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user's coordinator id"],
    },
    contractType: {
      type: String,
      enum: ["full-time", "part-time", "substitute"],
      required: [true, "Please provide a contract type"],
    },
    hoursAssignable: {
      type: Number,
      required: [
        true,
        "Please provide the number of hours assignable to the teacher",
      ],
    },
    hoursAssigned: {
      type: Number,
      required: [
        true,
        "Please provide the number of hours assigned to the teacher",
      ],
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

TeacherSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function () {
    // get the teacher
    const findTeacher: Teacher | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();
    // delete the teacher_fields instance/s
    await TeacherFieldModel.deleteMany({
      school_id: findTeacher?.school_id,
      teacher_id: findTeacher?._id,
    }).exec();
  }
);

const TeacherModel = model<Teacher>("Teacher", TeacherSchema);

export default TeacherModel;
