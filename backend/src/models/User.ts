import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../types';

// Use Omit to avoid conflicts with Document properties
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUserDocument>('User', UserSchema);