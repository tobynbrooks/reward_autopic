'use client';

import { useState, useEffect } from 'react';

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  title: string;
  status: 'active' | 'closed';
  lastMessageAt: string;
  unreadCount: number;
  lastMessage: string;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    title: 'Tyre redemption question',
    status: 'active',
    lastMessageAt: '2024-01-15T14:30:00Z',
    unreadCount: 2,
    lastMessage: 'How do I redeem my tyres for a discount?',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    title: 'Service appointment',
    status: 'active',
    lastMessageAt: '2024-01-15T12:15:00Z',
    unreadCount: 0,
    lastMessage: 'Thank you for scheduling my appointment!',
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Johnson',
    title: 'Account issue',
    status: 'closed',
    lastMessageAt: '2024-01-14T16:45:00Z',
    unreadCount: 0,
    lastMessage: 'Issue resolved, thanks for your help.',
  },
];

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    setConversations(MOCK_CONVERSATIONS);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const handleStatusChange = (conversationId: string, newStatus: 'active' | 'closed') => {
    setConversations(conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, status: newStatus }
        : conv
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Support Conversations</h2>
        <div className="flex space-x-4 text-sm text-gray-500">
          <span>Active: {conversations.filter(c => c.status === 'active').length}</span>
          <span>Closed: {conversations.filter(c => c.status === 'closed').length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation List */}
        <div>
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{conversation.userName}</h3>
                    {conversation.unreadCount > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      conversation.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {conversation.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {conversation.title}
                </p>
                <p className="text-sm text-gray-500 mb-2 truncate">
                  {conversation.lastMessage}
                </p>
                <div className="text-xs text-gray-400">
                  {formatTime(conversation.lastMessageAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="border rounded-lg bg-white">
          {selectedConversation ? (
            <div className="h-96 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedConversation.userName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.title}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(selectedConversation.id, 
                        selectedConversation.status === 'active' ? 'closed' : 'active')}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        selectedConversation.status === 'active'
                          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          : 'bg-green-200 text-green-800 hover:bg-green-300'
                      }`}
                    >
                      {selectedConversation.status === 'active' ? 'Close' : 'Reopen'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex justify-start">
                  <div className="max-w-xs bg-gray-100 rounded-lg p-3">
                    <p className="text-sm">{selectedConversation.lastMessage}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedConversation.userName} • {formatTime(selectedConversation.lastMessageAt)}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="max-w-xs bg-green-600 text-white rounded-lg p-3">
                    <p className="text-sm">Thanks for reaching out! I'll help you with that.</p>
                    <div className="text-xs text-green-100 mt-1">
                      Admin • 1h ago
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-3 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200">
            📅 Schedule Service
          </button>
          <button className="p-3 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200">
            🏎️ Add Tyres
          </button>
          <button className="p-3 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200">
            💰 Apply Discount
          </button>
          <button className="p-3 text-sm bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200">
            📋 View History
          </button>
        </div>
      </div>
    </div>
  );
}