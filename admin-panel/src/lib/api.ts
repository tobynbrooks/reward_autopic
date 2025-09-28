import { User, TyreTransaction, UserStats, ApiResponse, PaginatedResponse } from '../types';

// Mock data service for admin panel - matches the main app's mock structure
class AdminApiService {
  private mockUsers: User[] = [
    {
      id: 'mock-user-1',
      email: 'user@example.com',
      name: 'John Doe',
      carRegistration: 'ABC123',
      tyres: 8,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      notificationsEnabled: true,
    },
    {
      id: 'mock-user-2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      carRegistration: 'XYZ789',
      tyres: 15,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notificationsEnabled: false,
    },
    {
      id: 'mock-user-3',
      email: 'mike@example.com',
      name: 'Mike Johnson',
      carRegistration: 'DEF456',
      tyres: 3,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notificationsEnabled: true,
    },
  ];

  private mockTransactions: TyreTransaction[] = [
    {
      id: '1',
      userId: 'mock-user-1',
      amount: 5,
      type: 'earned',
      description: 'Car service visit',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      userId: 'mock-user-1',
      amount: 3,
      type: 'earned',
      description: 'MOT check',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      userId: 'mock-user-2',
      amount: 10,
      type: 'earned',
      description: 'Tyre replacement',
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      userId: 'mock-user-2',
      amount: 5,
      type: 'redeemed',
      description: 'Discount applied',
      createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // User management
  async getUsers(page: number = 1, pageSize: number = 10, search?: string): Promise<PaginatedResponse<User>> {
    await this.delay();

    let filteredUsers = [...this.mockUsers];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.carRegistration.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      total: filteredUsers.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredUsers.length / pageSize),
    };
  }

  async getUser(userId: string): Promise<ApiResponse<User>> {
    await this.delay();

    const user = this.mockUsers.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User not found', data: null as any };
    }

    return { success: true, data: user };
  }

  async updateUserPoints(userId: string, amount: number, description: string): Promise<ApiResponse<User>> {
    await this.delay();

    const userIndex = this.mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'User not found', data: null as any };
    }

    // Update user's tyre balance
    const user = this.mockUsers[userIndex];
    const newBalance = Math.max(0, user.tyres + amount);

    this.mockUsers[userIndex] = {
      ...user,
      tyres: newBalance,
      updatedAt: new Date().toISOString(),
    };

    // Add transaction record
    const transaction: TyreTransaction = {
      id: `transaction-${Date.now()}`,
      userId,
      amount: Math.abs(amount),
      type: amount > 0 ? 'earned' : 'redeemed',
      description,
      createdAt: new Date().toISOString(),
      metadata: { addedByAdmin: true },
    };

    this.mockTransactions.unshift(transaction);

    return { success: true, data: this.mockUsers[userIndex] };
  }

  // Transaction management
  async getUserTransactions(userId: string): Promise<ApiResponse<TyreTransaction[]>> {
    await this.delay();

    const transactions = this.mockTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { success: true, data: transactions };
  }

  async getAllTransactions(page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<TyreTransaction & { userName: string }>> {
    await this.delay();

    const transactionsWithUsers = this.mockTransactions
      .map(transaction => {
        const user = this.mockUsers.find(u => u.id === transaction.userId);
        return {
          ...transaction,
          userName: user?.name || 'Unknown User',
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = transactionsWithUsers.slice(startIndex, endIndex);

    return {
      data: paginatedTransactions,
      total: transactionsWithUsers.length,
      page,
      pageSize,
      totalPages: Math.ceil(transactionsWithUsers.length / pageSize),
    };
  }

  // Analytics
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    await this.delay();

    const totalUsers = this.mockUsers.length;
    const activeUsers = this.mockUsers.filter(u =>
      new Date(u.updatedAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
    ).length;

    const totalTyresEarned = this.mockTransactions
      .filter(t => t.type === 'earned')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalTyresRedeemed = this.mockTransactions
      .filter(t => t.type === 'redeemed')
      .reduce((sum, t) => sum + t.amount, 0);

    const averageTyresPerUser = totalUsers > 0
      ? this.mockUsers.reduce((sum, u) => sum + u.tyres, 0) / totalUsers
      : 0;

    const stats: UserStats = {
      totalUsers,
      activeUsers,
      totalTyresEarned,
      totalTyresRedeemed,
      averageTyresPerUser: Math.round(averageTyresPerUser * 100) / 100,
    };

    return { success: true, data: stats };
  }
}

export const adminApi = new AdminApiService();
export default adminApi;