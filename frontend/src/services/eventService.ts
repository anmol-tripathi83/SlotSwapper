import api from './api';
import type { Event } from '../types';

export const eventService = {
  createEvent: async (eventData: {
    title: string;
    startTime: string;
    endTime: string;
    status: 'BUSY' | 'SWAPPABLE';
  }): Promise<Event> => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  getMyEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/my-events');
    return response.data;
  },

  updateEvent: async (id: string, updates: Partial<Event>): Promise<Event> => {
    const response = await api.put(`/events/${id}`, updates);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};