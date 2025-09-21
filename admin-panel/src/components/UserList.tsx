'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  carRegistration: string;
  tyres: number;
  createdAt: string;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    carRegistration: 'ABC123',
    tyres: 12,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    carRegistration: 'XYZ789',
    tyres: 8,
    createdAt: '2024-01-20T14:20:00Z',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    carRegistration: 'DEF456',
    tyres: 25,
    createdAt: '2024-02-01T09:15:00Z',
  },
];

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tyreAdjustment, setTyreAdjustment] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    setUsers(MOCK_USERS);
  }, []);

  const handleTyreAdjustment = (userId: string, adjustment: number, reason: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, tyres: Math.max(0, user.tyres + adjustment) }
        : user
    ));
    setSelectedUser(null);
    setTyreAdjustment('');
    setAdjustmentReason('');
    alert(`Tyre adjustment applied: ${adjustment > 0 ? '+' : ''}${adjustment} tyres for ${reason}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <div className="text-sm text-gray-500">
          Total Users: {users.length}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tyres
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.carRegistration}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🏎️</span>
                    <span className="text-lg font-semibold text-green-600">{user.tyres}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    Adjust Tyres
                  </button>
                  <button className="text-blue-600 hover:text-blue-900">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tyre Adjustment Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Adjust Tyres for {selectedUser.name}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Tyres: <span className="font-bold text-green-600">{selectedUser.tyres}</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter adjustment (+/- amount)"
                  value={tyreAdjustment}
                  onChange={(e) => setTyreAdjustment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select reason...</option>
                  <option value="Service visit">Service visit</option>
                  <option value="MOT test">MOT test</option>
                  <option value="Parts purchase">Parts purchase</option>
                  <option value="Promotional bonus">Promotional bonus</option>
                  <option value="Manual adjustment">Manual adjustment</option>
                  <option value="Error correction">Error correction</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const adjustment = parseInt(tyreAdjustment);
                    if (!isNaN(adjustment) && adjustmentReason) {
                      handleTyreAdjustment(selectedUser.id, adjustment, adjustmentReason);
                    }
                  }}
                  disabled={!tyreAdjustment || !adjustmentReason}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  Apply Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}