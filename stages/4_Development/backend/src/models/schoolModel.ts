import { Schema, model } from "mongoose";
import { School } from "../interfaces/schoolInterface";

const SchoolSchema = new Schema<School>(
  {
    name: {
      type: String,
      required: [true, "must provide name for the task"],
      unique: true,
    },
    // createdBy: {
    //   // the id is going to be passed by the auth middleware decoding jwt part
    //   type: mongoose.Types.ObjectId,
    //   //this is the name of the other model
    //   ref: "User",
    //   required: [true, "Please provide a user"],
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SchoolModel = model("school", SchoolSchema);

export default SchoolModel;
