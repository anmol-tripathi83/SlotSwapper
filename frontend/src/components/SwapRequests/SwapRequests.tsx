import React, { useState, useEffect } from 'react';
import type { SwapRequest } from '../../types';
import { swapService } from '../../services/swapService';

interface MySwapRequests {
  incomingRequests: SwapRequest[];
  outgoingRequests: SwapRequest[];
}

const SwapRequests: React.FC = () => {
  const [swapRequests, setSwapRequests] = useState<MySwapRequests>({
    incomingRequests: [],
    outgoingRequests: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSwapRequests();
  }, []);

  const loadSwapRequests = async () => {
    setLoading(true);
    try {
      const requests = await swapService.getMySwapRequests();
      setSwapRequests(requests);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId: string, accept: boolean) => {
    try {
      await swapService.respondToSwapRequest(requestId, accept);
      alert(`Swap request ${accept ? 'accepted' : 'rejected'}!`);
      loadSwapRequests(); // Reload to reflect the change
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${accept ? 'accept' : 'reject'} swap request`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Safe accessor functions to prevent null errors
  const getRequesterSlotTitle = (request: SwapRequest) => {
    return request.requesterSlotId?.title || 'Unknown Slot';
  };

  const getRequesteeSlotTitle = (request: SwapRequest) => {
    return request.requesteeSlotId?.title || 'Unknown Slot';
  };

  const getRequesterSlotTime = (request: SwapRequest) => {
    return request.requesterSlotId?.startTime ? formatDate(request.requesterSlotId.startTime) : 'Unknown time';
  };

  const getRequesteeSlotTime = (request: SwapRequest) => {
    return request.requesteeSlotId?.startTime ? formatDate(request.requesteeSlotId.startTime) : 'Unknown time';
  };

  const getRequesterName = (request: SwapRequest) => {
    return request.requesterUserId?.name || 'Unknown User';
  };

  const getRequesteeName = (request: SwapRequest) => {
    return request.requesteeUserId?.name || 'Unknown User';
  };

  if (loading) {
    return <div className="text-center py-4">Loading swap requests...</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Swap Requests</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Incoming Requests */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Incoming Requests</h3>
        {swapRequests.incomingRequests.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No incoming swap requests.</div>
        ) : (
          <div className="space-y-4">
            {swapRequests.incomingRequests.map(request => (
              <div key={request._id} className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-medium">
                      {getRequesterName(request)} wants to swap
                    </h4>
                    <p className="text-sm text-gray-500">
                      Their slot: {getRequesterSlotTitle(request)} ({getRequesterSlotTime(request)})
                    </p>
                    <p className="text-sm text-gray-500">
                      For your slot: {getRequesteeSlotTitle(request)} ({getRequesteeSlotTime(request)})
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  {request.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRespond(request._id, true)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(request._id, false)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outgoing Requests */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Outgoing Requests</h3>
        {swapRequests.outgoingRequests.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No outgoing swap requests.</div>
        ) : (
          <div className="space-y-4">
            {swapRequests.outgoingRequests.map(request => (
              <div key={request._id} className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
                <div>
                  <h4 className="text-lg font-medium">
                    You requested to swap with {getRequesteeName(request)}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Your slot: {getRequesterSlotTitle(request)} ({getRequesterSlotTime(request)})
                  </p>
                  <p className="text-sm text-gray-500">
                    Their slot: {getRequesteeSlotTitle(request)} ({getRequesteeSlotTime(request)})
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapRequests;