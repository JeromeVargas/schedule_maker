import { Schema, model } from "mongoose";
import { Group, Subject } from "../../typings/types";
import ClassModel from "../classes/classModel";
import SubjectModel from "../subjects/subjectModel";

const GroupSchema = new Schema<Group>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide a school id for the group"],
    },
    level_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a schedule id for the group"],
    },
    coordinator_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "must provide a coordinator id for the group"],
    },
    name: {
      type: String,
      required: [true, "must provide name for the group"],
    },
    numberStudents: {
      type: Number,
      required: [true, "must provide a schedule id for the group"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

GroupSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function () {
    /* get the entities ids and references */
    // get the groups
    const findGroup: Group | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();
    // get the subjects
    const findSubjects: Subject[] = await SubjectModel.find({
      school_id: findGroup?.school_id,
      group_id: findGroup?._id,
    })
      .select("_id group_id")
      .lean()
      .exec();
    /* delete entities records in collections */
    // delete the subject instance/s
    await SubjectModel.deleteMany({
      school_id: findGroup?.school_id,
      group_id: findGroup?._id,
    }).exec();
    // delete the class instance/s
    await ClassModel.deleteMany({
      subject_id: {
        $in: findSubjects.map((subject) => subject._id),
      },
    });
  }
);

const GroupModel = model<Group>("Group", GroupSchema);

export default GroupModel;
