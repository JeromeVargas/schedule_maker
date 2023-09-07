import { Schema, model } from "mongoose";
import { Field } from "../../typings/types";
import TeacherFieldModel from "../teacher_fields/teacherFieldModel";

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
    /* delete entities records in collections */
    // delete the teacher_fields instance/s
    await TeacherFieldModel.deleteMany({
      school_id: findField?.school_id,
      field_id: findField?._id,
    }).exec();
  }
);

const FieldModel = model<Field>("Field", FieldSchema);

export default FieldModel;
