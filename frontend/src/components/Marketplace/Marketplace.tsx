import React, { useState, useEffect } from 'react';
import type { Event } from '../../types';
import { swapService } from '../../services/swapService';
import { eventService } from '../../services/eventService';

const Marketplace: React.FC = () => {
  const [swappableSlots, setSwappableSlots] = useState<Event[]>([]);
  const [mySwappableSlots, setMySwappableSlots] = useState<Event[]>([]);
  const [selectedMySlot, setSelectedMySlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [slots, myEvents] = await Promise.all([
        swapService.getSwappableSlots(),
        eventService.getMyEvents()
      ]);
      setSwappableSlots(slots);
      setMySwappableSlots(myEvents.filter(event => event.status === 'SWAPPABLE'));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    }
  };

  const handleRequestSwap = async (theirSlotId: string) => {
    if (!selectedMySlot) {
      alert('Please select one of your swappable slots to offer.');
      return;
    }

    setLoading(true);
    try {
      await swapService.createSwapRequest(selectedMySlot, theirSlotId);
      alert('Swap request sent successfully!');
      loadData(); // Reload data
      setSelectedMySlot('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send swap request');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Helper function to get user name from userId field
  const getUserName = (userId: string | { _id: string; name: string; email: string }): string => {
    if (typeof userId === 'object' && userId !== null) {
      return userId.name;
    }
    return 'Unknown User';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Marketplace</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* My Swappable Slots */}
      {mySwappableSlots.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Your Swappable Slots</h3>
          <select
            value={selectedMySlot}
            onChange={(e) => setSelectedMySlot(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select your slot to offer</option>
            {mySwappableSlots.map(slot => (
              <option key={slot._id} value={slot._id}>
                {slot.title} ({formatDate(slot.startTime)})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Available Slots */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Available Slots from Other Users</h3>
        
        {swappableSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No swappable slots available from other users.
          </div>
        ) : (
          swappableSlots.map(slot => (
            <div key={slot._id} className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium">{slot.title}</h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(slot.startTime)} - {formatDate(slot.endTime)}
                  </p>
                  <p className="text-sm text-gray-600">From: {getUserName(slot.userId)}</p>
                </div>
                <button
                  onClick={() => handleRequestSwap(slot._id)}
                  disabled={loading || !selectedMySlot}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Request Swap
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;