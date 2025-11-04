import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EventStatus = 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';

export interface IEvent {
  _id: Types.ObjectId;
  title: string;
  startTime: Date;
  endTime: Date;
  status: EventStatus;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type SwapStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface ISwapRequest {
  _id: Types.ObjectId;
  requesterSlotId: Types.ObjectId;
  requesteeSlotId: Types.ObjectId;
  status: SwapStatus;
  requesterUserId: Types.ObjectId;
  requesteeUserId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Frontend-friendly types (without mongoose Types.ObjectId)
export interface IUserFrontend {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEventFrontend {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISwapRequestFrontend {
  _id: string;
  requesterSlotId: string;
  requesteeSlotId: string;
  status: SwapStatus;
  requesterUserId: string;
  requesteeUserId: string;
  createdAt: string;
  updatedAt: string;
}