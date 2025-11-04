import mongoose, { Document, Schema } from 'mongoose';
import { IEvent } from '../types';

// Use Omit to avoid conflicts with Document properties
export interface IEventDocument extends Omit<IEvent, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'], required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEventDocument>('Event', EventSchema);