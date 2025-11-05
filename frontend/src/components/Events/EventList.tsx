import React, { useState, useEffect } from 'react';
import type { Event } from '../../types';
import { eventService } from '../../services/eventService';
import EventCard from './EventCard';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const userEvents = await eventService.getMyEvents();
      setEvents(userEvents);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: 'BUSY' | 'SWAPPABLE') => {
    try {
      await eventService.updateEvent(eventId, { status: newStatus });
      loadEvents(); // Reload events to reflect the change
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update event');
    }
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(eventId);
        loadEvents(); // Reload events to reflect the change
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading events...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No events found. Create your first event to get started!
        </div>
      ) : (
        events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default EventList;