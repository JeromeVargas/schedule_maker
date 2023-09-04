import { Schema, model } from "mongoose";
import { Teacher } from "../../typings/types";

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
    monday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    tuesday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    wednesday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    thursday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    friday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    saturday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
    sunday: {
      type: Boolean,
      required: [true, "Please provide if the teacher is available "],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// continue here --> if teacher or field is deleted, delete teacher_field relationships
const TeacherModel = model<Teacher>("Teacher", TeacherSchema);

export default TeacherModel;
