// Core user types
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

// Reward system types
export interface TyreTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'redeemed';
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface RewardTier {
  id: string;
  name: string;
  requiredTyres: number;
  description: string;
  benefits: string[];
}


// Onboarding types
export interface OnboardingData {
  name: string;
  email: string;
  carRegistration: string;
  notificationsEnabled: boolean;
}

// Navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Login: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Rewards: undefined;
  Profile: undefined;
};

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Supabase database types (placeholders for future implementation)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<User, 'id' | 'createdAt'>>;
      };
      tyre_transactions: {
        Row: TyreTransaction;
        Insert: Omit<TyreTransaction, 'id' | 'createdAt'>;
        Update: Partial<Omit<TyreTransaction, 'id' | 'createdAt'>>;
      };
    };
  };
}