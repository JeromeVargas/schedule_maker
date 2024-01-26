import { Schema, model } from "mongoose";
import GroupCoordinatorModel from "../group_coordinators/groupCoordinatorModel";
import SessionModel from "../sessions/sessionModel";
import { Group, Group_Coordinator } from "../../typings/types";

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
    // get the group_coordinators
    const findGroupCoordinators: Group_Coordinator[] =
      await GroupCoordinatorModel.find({
        school_id: findGroup?.school_id,
        group_id: findGroup?._id,
      })
        .select("_id")
        .lean()
        .exec();
    /* delete entities records in collections */
    // delete the session instance/s
    await GroupCoordinatorModel.deleteMany({
      school_id: findGroup?.school_id,
      group_id: findGroup?._id,
    }).exec();
    // delete the session instance/s
    await SessionModel.deleteMany({
      school_id: findGroup?.school_id,
      groupCoordinator_id: { $in: findGroupCoordinators },
    }).exec();
  }
);

const GroupModel = model<Group>("Group", GroupSchema);

export default GroupModel;
