import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Layout/Navigation';
import EventList from '../components/Events/EventList';
import EventForm from '../components/Events/EventForm';
import Marketplace from '../components/Marketplace/Marketplace';
import SwapRequests from '../components/SwapRequests/SwapRequests';
import LoadingSpinner from '../components/Common/LoadingSpinner';

type ActiveTab = 'events' | 'marketplace' | 'requests';

const DashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('events');
  const [showEventForm, setShowEventForm] = useState(false);

  // Create a wrapper function that accepts string and asserts it as ActiveTab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ActiveTab);
  };

  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" text="Loading your dashboard..." />
        </div>
      );
    }

    switch (activeTab) {
      case 'events':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Schedule</h2>
                <p className="text-gray-600">Manage your time slots and availability</p>
              </div>
              <button
                onClick={() => setShowEventForm(true)}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-sm"
              >
                + Add Time Slot
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-slide-up">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;