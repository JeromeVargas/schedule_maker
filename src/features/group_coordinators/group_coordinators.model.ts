import { Schema, model } from "mongoose";
import SessionModel from "../sessions/sessions.model";
import { Group_Coordinator } from "../../typings/types";

const GroupCoordinatorSchema = new Schema<Group_Coordinator>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide name for the task"],
    },
    group_id: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: [true, "must provide a group"],
    },
    coordinator_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "must provide coordinator"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

GroupCoordinatorSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function () {
    /* get the entities ids and references */
    // get the group_coordinator
    const findGroupCoordinator: Group_Coordinator | null = await this.model
      // getFilter gets the parameters from the parent call, in this case findOneAndDelete
      .findOne(this.getFilter(), { _id: 1, school_id: 1 })
      .lean();

    /* update entities records in collections */
    // update the session instance/s
    await SessionModel.updateMany(
      {
        school_id: findGroupCoordinator?.school_id,
        groupCoordinator_id: findGroupCoordinator?._id,
      },
      { $set: { groupCoordinator_id: null } }
    ).exec();
  }
);

const GroupCoordinatorModel = model<Group_Coordinator>(
  "Group_Coordinator",
  GroupCoordinatorSchema
);

export default GroupCoordinatorModel;
