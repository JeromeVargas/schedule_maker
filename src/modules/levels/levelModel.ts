import { Schema, model } from "mongoose";
import { Class, Group, Level, Subject } from "../../typings/types";
import ClassModel from "../classes/classModel";
import GroupModel from "../groups/groupModel";
import SubjectModel from "../subjects/subjectModel";

const LevelSchema = new Schema<Level>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide a school id for the level"],
    },
    schedule_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide a schedule id for the level"],
    },
    name: {
      type: String,
      required: [true, "must provide name for the level"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

LevelSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function () {
    /* get the entities ids and references */
    // get the level
    const findLevel: Level | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();
    // get the groups
    const findGroups: Group[] = await GroupModel.find({
      school_id: findLevel?.school_id,
      level_id: findLevel?._id,
    })
      .select("_id level_id")
      .lean()
      .exec();
    // get the subjects
    const findSubjects: Subject[] = await SubjectModel.find({
      school_id: findLevel?.school_id,
      group_id: {
        $in: findGroups.map((group) => group._id),
      },
    })
      .select("_id group_id")
      .lean()
      .exec();
    /* delete entities records in collections */
    // delete the group instance/s
    await GroupModel.deleteMany({
      school_id: findLevel?.school_id,
      level_id: findLevel?._id,
    }).exec();
    // delete the subject instance/s
    await SubjectModel.deleteMany({
      group_id: {
        $in: findGroups.map((group) => group._id),
      },
    });
    // delete the class instance/s
    await ClassModel.deleteMany({
      subject_id: {
        $in: findSubjects.map((subject) => subject._id),
      },
    });
  }
);

const LevelModel = model<Level>("Level", LevelSchema);

export default LevelModel;
