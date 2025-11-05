import React, { useState } from 'react';
import { OfferManagement } from './OfferManagement';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { SsoConfiguration } from './SsoConfiguration';
import { GoldenRecordsManagement } from './GoldenRecordsManagement';

interface AdminDashboardProps {
  user?: {
    name: string;
    role: string;
    permissions: string[];
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('offers');

  const tabs = [
    { id: 'offers', name: 'Offer Management', icon: '🎯' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'banks', name: 'Golden Records', icon: '🏦' },
    { id: 'sso', name: 'SSO Configuration', icon: '🔐' },
    { id: 'rules', name: 'Rules Engine', icon: '⚙️' },
    { id: 'audit', name: 'Audit Trail', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.name} ({user?.role})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                System Online
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            {activeTab === 'offers' && <OfferManagement />}
            {activeTab === 'banks' && <GoldenRecordsManagement />}
            {activeTab === 'sso' && <SsoConfiguration />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'rules' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Rules Engine</h2>
                <p className="text-gray-600">
                  Configure offer eligibility rules and calculation logic.
                </p>
              </div>
            )}
            {activeTab === 'audit' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit Trail</h2>
                <p className="text-gray-600">
                  Review system activities and compliance logs.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};