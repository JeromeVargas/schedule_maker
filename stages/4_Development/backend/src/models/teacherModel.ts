import { Schema, model } from "mongoose";
import { Teacher } from "../interfaces/interfaces";

const TeacherSchema = new Schema<Teacher>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "Please provide a school name"],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: [true, "Please provide the user's id"],
    },
    coordinator_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user's coordinator id"],
    },
    contractType: {
      type: String,
      enum: ["full-time", "part-time", "substitute"],
      required: [true, "Please provide a contract type"],
    },
    hoursAssignable: {
      type: Number,
      required: [
        true,
        "Please provide the number of hours assignable to the teacher",
      ],
    },
    hoursAssigned: {
      type: Number,
      required: [
        true,
        "Please provide the number of hours assigned to the teacher",
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TeacherModel = model<Teacher>("teacher", TeacherSchema);

export default TeacherModel;
