import { Schema, model } from "mongoose";
import SessionModel from "../sessions/sessions.model";
import GroupModel from "../groups/groups.model";
import SubjectModel from "../subjects/subjects.model";
import { Level } from "../../typings/types";

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

    /* delete entities records in collections */
    // delete the group instance/s
    await GroupModel.deleteMany({
      school_id: findLevel?.school_id,
      level_id: findLevel?._id,
    }).exec();
    // delete the subject instance/s
    await SubjectModel.deleteMany({
      school_id: findLevel?.school_id,
      level_id: findLevel?._id,
    });
    // delete the session instance/s
    await SessionModel.deleteMany({
      school_id: findLevel?.school_id,
      level_id: findLevel?._id,
    });
  }
);

const LevelModel = model<Level>("Level", LevelSchema);

export default LevelModel;
