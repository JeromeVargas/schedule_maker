import { Schema, model } from "mongoose";
import { Subject } from "../../typings/types";
import ClassModel from "../classes/classModel";

const SubjectSchema = new Schema<Subject>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide a school id for the subject"],
    },
    coordinator_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "must provide a user coordinator id for the subject"],
    },
    group_id: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: [true, "must provide a group id for the subject"],
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
    classUnits: {
      type: Number,
      required: [
        true,
        "must provide the number of class units for this subject during the week",
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
    // get the subject
    const findSubject: Subject | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();
    /* delete entities records in collections */
    // delete the class instance/s
    await ClassModel.deleteMany({
      school_id: findSubject?.school_id,
      subject_id: findSubject?._id,
    }).exec();
  }
);

const SubjectModel = model<Subject>("Subject", SubjectSchema);

export default SubjectModel;
