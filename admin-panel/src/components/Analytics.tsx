'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalUsers: number;
  totalTyres: number;
  tyresRedeemed: number;
  activeConversations: number;
  monthlySignups: number;
  avgTyresPerUser: number;
}

const MOCK_ANALYTICS: AnalyticsData = {
  totalUsers: 1247,
  totalTyres: 18653,
  tyresRedeemed: 4891,
  activeConversations: 23,
  monthlySignups: 89,
  avgTyresPerUser: 14.9,
};

const MONTHLY_DATA = [
  { month: 'Jan', users: 156, tyres: 2340, redemptions: 578 },
  { month: 'Feb', users: 189, tyres: 2890, redemptions: 672 },
  { month: 'Mar', users: 234, tyres: 3456, redemptions: 789 },
  { month: 'Apr', users: 278, tyres: 4123, redemptions: 934 },
  { month: 'May', users: 312, tyres: 4567, redemptions: 1023 },
  { month: 'Jun', users: 345, tyres: 5234, redemptions: 1178 },
];

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    setAnalytics(MOCK_ANALYTICS);
  }, []);

  if (!analytics) {
    return <div className="p-6">Loading analytics...</div>;
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon, 
    color = 'blue' 
  }: { 
    title: string; 
    value: string | number; 
    change?: string; 
    icon: string;
    color?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-md bg-${color}-100`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600">
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers.toLocaleString()}
          change="+12% this month"
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Total Tyres Earned"
          value={analytics.totalTyres.toLocaleString()}
          change="+8% this month"
          icon="🏎️"
          color="green"
        />
        <StatCard
          title="Tyres Redeemed"
          value={analytics.tyresRedeemed.toLocaleString()}
          change="+15% this month"
          icon="🎁"
          color="purple"
        />
        <StatCard
          title="Active Chats"
          value={analytics.activeConversations}
          icon="💬"
          color="yellow"
        />
        <StatCard
          title="Monthly Signups"
          value={analytics.monthlySignups}
          change="+23% vs last month"
          icon="📈"
          color="indigo"
        />
        <StatCard
          title="Avg Tyres/User"
          value={analytics.avgTyresPerUser.toFixed(1)}
          icon="⚖️"
          color="pink"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
          <div className="space-y-4">
            {MONTHLY_DATA.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{month.month}</span>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                    <span>{month.users} users</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span>{month.tyres} tyres</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                    <span>{month.redemptions} redeemed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mike Johnson</p>
                <p className="text-sm text-gray-500">Most tyres earned</p>
              </div>
              <span className="text-lg font-semibold text-green-600">25 🏎️</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Sarah Wilson</p>
                <p className="text-sm text-gray-500">Most active user</p>
              </div>
              <span className="text-lg font-semibold text-blue-600">18 visits</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500">Recent redemption</p>
              </div>
              <span className="text-lg font-semibold text-purple-600">15 🎁</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">Redemption Rate</p>
            <p className="text-2xl font-bold text-green-900">26.2%</p>
            <p className="text-xs text-green-600">+3.1% from last month</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">User Retention</p>
            <p className="text-2xl font-bold text-blue-900">78.5%</p>
            <p className="text-xs text-blue-600">Stable</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-800">Avg Response Time</p>
            <p className="text-2xl font-bold text-purple-900">2.3h</p>
            <p className="text-xs text-purple-600">-0.5h improvement</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">Satisfaction</p>
            <p className="text-2xl font-bold text-yellow-900">4.7/5</p>
            <p className="text-xs text-yellow-600">+0.2 from last month</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-6 flex justify-end space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
          📊 Export to Excel
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
          📈 Generate Report
        </button>
      </div>
    </div>
  );
}