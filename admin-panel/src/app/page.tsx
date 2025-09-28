'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, Activity, Plus, Search, Edit2 } from 'lucide-react';
import { User, UserStats, TyreTransaction } from '@/types';
import { adminApi } from '@/lib/api';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTyresEarned: number;
  totalTyresRedeemed: number;
  averageTyresPerUser: number;
}

interface RecentTransaction extends TyreTransaction {
  userName: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pointsAmount, setPointsAmount] = useState('');
  const [pointsDescription, setPointsDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, usersResponse, transactionsResponse] = await Promise.all([
        adminApi.getUserStats(),
        adminApi.getUsers(1, 10),
        adminApi.getAllTransactions(1, 5),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (usersResponse) {
        setUsers(usersResponse.data);
      }

      if (transactionsResponse) {
        setRecentTransactions(transactionsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = async () => {
    if (!selectedUser || !pointsAmount || !pointsDescription) return;

    setIsSubmitting(true);
    try {
      const amount = parseInt(pointsAmount);
      const response = await adminApi.updateUserPoints(
        selectedUser.id,
        amount,
        pointsDescription
      );

      if (response.success) {
        // Update the user in the list
        setUsers(prev => prev.map(u =>
          u.id === selectedUser.id ? response.data : u
        ));

        // Reset form
        setSelectedUser(null);
        setPointsAmount('');
        setPointsDescription('');

        // Reload dashboard data to get updated stats and transactions
        loadDashboardData();

        alert('Points added successfully!');
      } else {
        alert('Failed to add points: ' + response.error);
      }
    } catch (error) {
      alert('Failed to add points');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.carRegistration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tyres Earned</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalTyresEarned || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. per User</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.averageTyresPerUser || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">Car: {user.carRegistration}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">{user.tyres} tyres</p>
                      <p className="text-xs text-gray-500">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-md"
                      title="Add/Remove Points"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Points Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedUser ? `Add Points to ${selectedUser.name}` : 'Select User to Add Points'}
            </h2>
          </div>
          <div className="p-6">
            {selectedUser ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points Amount
                  </label>
                  <input
                    type="number"
                    value={pointsAmount}
                    onChange={(e) => setPointsAmount(e.target.value)}
                    placeholder="Enter positive or negative number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use positive numbers to add points, negative to deduct
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={pointsDescription}
                    onChange={(e) => setPointsDescription(e.target.value)}
                    placeholder="Reason for points adjustment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddPoints}
                    disabled={isSubmitting || !pointsAmount || !pointsDescription}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Update Points'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setPointsAmount('');
                      setPointsDescription('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Current User Info</h4>
                  <p className="text-sm text-gray-600">Current balance: {selectedUser.tyres} tyres</p>
                  <p className="text-sm text-gray-600">Email: {selectedUser.email}</p>
                  <p className="text-sm text-gray-600">Car: {selectedUser.carRegistration}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a user from the left to add or remove points</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{transaction.userName}</p>
                  <p className="text-sm text-gray-600">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className={`text-right ${
                  transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <p className="font-semibold">
                    {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} tyres
                  </p>
                  <p className="text-xs capitalize">{transaction.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}