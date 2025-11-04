export interface User {
  id: string;
  name: string;
  email: string;
}

export type EventStatus = 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';

export interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  userId: string | { _id: string; name: string; email: string }; // Allow both string and populated user object
  createdAt: string;
  updatedAt: string;
}

export type SwapStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface SwapRequest {
  _id: string;
  requesterSlotId: Event;
  requesteeSlotId: Event;
  status: SwapStatus;
  requesterUserId: User;
  requesteeUserId: User;
  createdAt: string;
  updatedAt: string;
}

export interface MySwapRequests {
  incomingRequests: SwapRequest[];
  outgoingRequests: SwapRequest[];
}

export interface AuthResponse {
  token: string;
  user: User;
}