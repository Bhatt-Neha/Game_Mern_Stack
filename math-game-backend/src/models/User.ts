
import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../types/UserTypes";

export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema<IUserDocument> = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  profilePicture: { type: String, required: true },
  birthdate: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUserDocument>("User", UserSchema);