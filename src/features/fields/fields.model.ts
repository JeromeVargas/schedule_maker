import { Schema, model } from "mongoose";
import { Field, Teacher_Field } from "../../typings/types";
import TeacherFieldModel from "../teacher_fields/teacher_fields.model";
import SessionModel from "../sessions/sessions.model";
import SubjectModel from "../subjects/subjects.model";

const FieldSchema = new Schema<Field>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide a school id for the field"],
    },
    name: {
      type: String,
      required: [true, "must provide name for the field"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

FieldSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function () {
    /* get the entities ids and references */
    // get the field
    const findField: Field | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();
    // get the teacher_fields
    const findTeacherFields: Teacher_Field[] = await TeacherFieldModel.find({
      school_id: findField?.school_id,
      field_id: findField?._id,
    })
      .select("_id")
      .lean()
      .exec();

    /* delete entities records in collections */
    // delete the teacher_fields instance/s
    await TeacherFieldModel.deleteMany({
      school_id: findField?.school_id,
      field_id: findField?._id,
    }).exec();

    /* update entities records in collections */
    // update the subject instance/s
    await SubjectModel.updateMany(
      {
        school_id: findField?.school_id,
        field_id: findField?._id,
      },
      { $set: { field_id: null } }
    ).exec();
    // update the session instance/s
    await SessionModel.updateMany(
      { teacherField_id: { $in: findTeacherFields } },
      { teacherField_id: null }
    );
  }
);

const FieldModel = model<Field>("Field", FieldSchema);

export default FieldModel;
