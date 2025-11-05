import React from 'react';
import type { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onStatusChange: (eventId: string, newStatus: 'BUSY' | 'SWAPPABLE') => void;
  onDelete: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onStatusChange, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'SWAPPABLE':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '🔄',
          label: 'Available for Swap'
        };
      case 'SWAP_PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⏳',
          label: 'Swap Pending'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '📅',
          label: 'Busy'
        };
    }
  };

  const statusConfig = getStatusConfig(event.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {event.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <span className="mr-2">🕒</span>
            {formatDate(event.startTime)} - {formatDate(event.endTime)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
            <span className="mr-1">{statusConfig.icon}</span>
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Created {new Date(event.createdAt).toLocaleDateString()}
        </div>
        
        {event.status !== 'SWAP_PENDING' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusChange(event._id, event.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                event.status === 'SWAPPABLE' 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {event.status === 'SWAPPABLE' ? 'Mark as Busy' : 'Make Swappable'}
            </button>
            
            <button
              onClick={() => onDelete(event._id)}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;