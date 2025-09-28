// Shared types with the main app
export interface User {
  id: string;
  email: string;
  name: string;
  carRegistration: string;
  tyres: number;
  createdAt: string;
  updatedAt: string;
  notificationsEnabled: boolean;
}

export interface TyreTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'redeemed';
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  createdAt: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  totalTyresEarned: number;
  totalTyresRedeemed: number;
  averageTyresPerUser: number;
}