import { Schema, model } from "mongoose";
import { TeacherField } from "../../typings/types";
import SessionModel from "../sessions/sessions.model";

const TeacherFieldSchema = new Schema<TeacherField>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide name for the task"],
    },
    teacher_id: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "must provide name for the task"],
    },
    field_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide name for the task"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TeacherFieldSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function () {
    /* get the entities ids and references */
    // get the field
    const findTeacherField: TeacherField | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();

    /* update entities records in collections */
    // update the session instance/s
    await SessionModel.updateMany(
      {
        school_id: findTeacherField?.school_id,
        teacherField_id: findTeacherField?._id,
      },
      { teacherField_id: null }
    );
  }
);

const TeacherFieldModel = model<TeacherField>(
  "TeacherField",
  TeacherFieldSchema
);

export default TeacherFieldModel;
