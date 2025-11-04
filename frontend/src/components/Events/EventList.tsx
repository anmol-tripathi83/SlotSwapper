import React, { useState, useEffect } from 'react';
import type { Event } from '../../types';
import { eventService } from '../../services/eventService';

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SWAPPABLE':
        return 'bg-green-100 text-green-800';
      case 'SWAP_PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <div key={event._id} className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{event.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {formatDate(event.startTime)} - {formatDate(event.endTime)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
                
                {event.status !== 'SWAP_PENDING' && (
                  <button
                    onClick={() => handleStatusChange(event._id, event.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE')}
                    className={`px-3 py-1 text-xs rounded ${
                      event.status === 'SWAPPABLE' 
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                        : 'bg-green-200 text-green-800 hover:bg-green-300'
                    }`}
                  >
                    {event.status === 'SWAPPABLE' ? 'Mark as Busy' : 'Mark as Swappable'}
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(event._id)}
                  className="px-3 py-1 text-xs bg-red-200 text-red-800 rounded hover:bg-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EventList;