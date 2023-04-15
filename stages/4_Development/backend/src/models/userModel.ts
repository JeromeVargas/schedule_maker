import { Schema, model } from "mongoose";
import { User } from "../interfaces/interfaces";

const UserSchema = new Schema<User>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "Please provide a school name"],
    },
    firstName: {
      type: String,
      required: [true, "Please provide a first name for the user"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name for the user"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email for the user"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password for the user"],
    },
    role: {
      type: String,
      enum: ["headmaster", "coordinator", "teacher"],
      required: [true, "Please provide a role for the user"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      required: [true, "Please provide a status for the user"],
    },
    hasTeachingFunc: {
      type: Boolean,
      required: [true, "Please confirm the user has teaching functions"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = model<User>("User", UserSchema);

export default UserModel;
