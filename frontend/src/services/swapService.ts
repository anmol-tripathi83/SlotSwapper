import api from './api';
import type { Event, SwapRequest, MySwapRequests } from '../types';

export const swapService = {
  getSwappableSlots: async (): Promise<Event[]> => {
    const response = await api.get('/swappable-slots');
    return response.data;
  },

  createSwapRequest: async (mySlotId: string, theirSlotId: string): Promise<SwapRequest> => {
    const response = await api.post('/swap-request', { mySlotId, theirSlotId });
    return response.data;
  },

  respondToSwapRequest: async (requestId: string, accept: boolean): Promise<{ message: string; swapRequest: SwapRequest }> => {
    const response = await api.post(`/swap-response/${requestId}`, { accept });
    return response.data;
  },

  getMySwapRequests: async (): Promise<MySwapRequests> => {
    const response = await api.get('/my-swap-requests');
    return response.data;
  },
};