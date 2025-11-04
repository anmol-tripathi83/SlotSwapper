import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EventList from '../components/Events/EventList';
import EventForm from '../components/Events/EventForm';
import Marketplace from '../components/Marketplace/Marketplace';
import SwapRequests from '../components/SwapRequests/SwapRequests';

type ActiveTab = 'events' | 'marketplace' | 'requests';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('events');
  const [showEventForm, setShowEventForm] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Events</h2>
              <button
                onClick={() => setShowEventForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create Event
              </button>
            </div>
            {showEventForm && (
              <EventForm onClose={() => setShowEventForm(false)} />
            )}
            <EventList />
          </div>
        );
      case 'marketplace':
        return <Marketplace />;
      case 'requests':
        return <SwapRequests />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">SlotXchange</h1>
              <div className="ml-10 flex space-x-4">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'events'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Events
                </button>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'marketplace'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Marketplace
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'requests'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Swap Requests
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;