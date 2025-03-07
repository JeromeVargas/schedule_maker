import { Schema, model } from "mongoose";
import SessionModel from "../sessions/sessions.model";
import { Subject } from "../../typings/types";

const SubjectSchema = new Schema<Subject>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide a school id for the subject"],
    },
    level_id: {
      type: Schema.Types.ObjectId,
      ref: "Level",
      required: [true, "must provide a level id for the subject"],
    },
    field_id: {
      type: Schema.Types.ObjectId,
      ref: "Field",
      required: [true, "must provide a field id for the subject"],
    },
    name: {
      type: String,
      required: [true, "must provide name for the subject"],
    },
    sessionUnits: {
      type: Number,
      required: [
        true,
        "must provide the number of session units for this subject during the week",
      ],
    },
    frequency: {
      type: Number,
      required: [
        true,
        "must provide the number number of times this subject is given in a week",
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

SubjectSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function () {
    /* get the entities ids and references */
    // get the group
    const findSubject: Subject | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();

    /* update entities records in collections */
    // update the session instance/s
    await SessionModel.updateMany(
      {
        school_id: findSubject?.school_id,
        subject_id: findSubject?._id,
      },
      { $set: { subject_id: null } }
    ).exec();
  }
);

const SubjectModel = model<Subject>("Subject", SubjectSchema);

export default SubjectModel;
