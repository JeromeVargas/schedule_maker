import { Schema, model } from "mongoose";
import SessionModel from "../sessions/sessionModel";
import { Group } from "../../typings/types";

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
    // get the group
    const findGroup: Group | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();
    /* delete entities records in collections */
    // delete the session instance/s
    await SessionModel.deleteMany({
      school_id: findGroup?.school_id,
      group_id: findGroup?._id,
    }).exec();
  }
);

const GroupModel = model<Group>("Group", GroupSchema);

export default GroupModel;
