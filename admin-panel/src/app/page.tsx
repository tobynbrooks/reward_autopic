'use client';

import { useState, useEffect } from 'react';
import UserList from '@/components/UserList';
import ConversationList from '@/components/ConversationList';
import Analytics from '@/components/Analytics';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', name: 'Users & Tyres', icon: '👥' },
    { id: 'conversations', name: 'Support Chat', icon: '💬' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
  ];

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage users, handle support requests, and track analytics
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'users' && <UserList />}
        {activeTab === 'conversations' && <ConversationList />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  );
}