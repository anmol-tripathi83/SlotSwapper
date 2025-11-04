import mongoose, { Document, Schema } from 'mongoose';
import { ISwapRequest } from '../types';

// Use Omit to avoid conflicts with Document properties
export interface ISwapRequestDocument extends Omit<ISwapRequest, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const SwapRequestSchema: Schema = new Schema(
  {
    requesterSlotId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    requesteeSlotId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], required: true },
    requesterUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requesteeUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISwapRequestDocument>('SwapRequest', SwapRequestSchema);