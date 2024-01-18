import { Schema, model } from "mongoose";
import { Teacher, Teacher_Field } from "../../typings/types";
import TeacherFieldModel from "../teacher_fields/teacherFieldModel";
import SessionModel from "../sessions/sessionModel";

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
    teachingHoursAssignable: {
      type: Number,
      required: [
        true,
        "Please provide the number of teaching hours assignable to the teacher",
      ],
    },
    teachingHoursAssigned: {
      type: Number,
      required: [
        true,
        "Please provide the number of teaching hours assigned to the teacher",
      ],
    },
    adminHoursAssignable: {
      type: Number,
      required: [
        true,
        "Please provide the number of administrative hours assignable to the teacher",
      ],
    },
    adminHoursAssigned: {
      type: Number,
      required: [
        true,
        "Please provide the number of administrative hours assigned to the teacher",
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
    /* get the entities ids and references */
    // get the teacher
    const findTeacher: Teacher | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();
    // get the teacher_fields
    const findTeacherFields: Teacher_Field[] = await TeacherFieldModel.find({
      school_id: findTeacher?.school_id,
      teacher_id: findTeacher?._id,
    })
      .select("_id")
      .lean()
      .exec();
    /* delete entities records in collections */
    // delete the teacher_fields instance/s
    await TeacherFieldModel.deleteMany({
      school_id: findTeacher?.school_id,
      teacher_id: findTeacher?._id,
    }).exec();
    /* update entities records in collections */
    // update the session instance/s
    await SessionModel.updateMany(
      { teacherField_id: { $in: findTeacherFields } },
      { teacherField_id: null }
    );
  }
);

const TeacherModel = model<Teacher>("Teacher", TeacherSchema);

export default TeacherModel;
