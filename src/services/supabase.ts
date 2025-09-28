// Supabase service placeholder - Phase 1 implementation with mock data
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, TyreTransaction, OnboardingData } from '../types';

// Mock data for development
const MOCK_USER: User = {
  id: 'mock-user-1',
  email: 'user@example.com',
  name: 'John Doe',
  carRegistration: 'ABC123',
  tyres: 8,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  notificationsEnabled: true,
};

const MOCK_TRANSACTIONS: TyreTransaction[] = [
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
    userId: 'mock-user-1',
    amount: 2,
    type: 'redeemed',
    description: 'Discount applied',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
];

class SupabaseService {
  private isAuthenticated = false;
  private currentUser: User | null = null;

  // Auth methods
  async signUp(onboardingData: OnboardingData): Promise<{ user: User; error: null } | { user: null; error: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: onboardingData.email,
        name: onboardingData.name,
        carRegistration: onboardingData.carRegistration,
        tyres: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notificationsEnabled: onboardingData.notificationsEnabled,
      };

      // Store in AsyncStorage for persistence
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.setItem('isAuthenticated', 'true');
      
      this.currentUser = newUser;
      this.isAuthenticated = true;

      return { user: newUser, error: null };
    } catch (error) {
      return { user: null, error: 'Failed to create account' };
    }
  }

  async signIn(email: string): Promise<{ user: User; error: null } | { user: null; error: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For mock, always return the mock user
      await AsyncStorage.setItem('user', JSON.stringify(MOCK_USER));
      await AsyncStorage.setItem('isAuthenticated', 'true');
      
      this.currentUser = MOCK_USER;
      this.isAuthenticated = true;

      return { user: MOCK_USER, error: null };
    } catch (error) {
      return { user: null, error: 'Failed to sign in' };
    }
  }

  async signOut(): Promise<void> {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('isAuthenticated');
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;
    
    try {
      const userString = await AsyncStorage.getItem('user');
      const isAuth = await AsyncStorage.getItem('isAuthenticated');
      
      if (userString && isAuth === 'true') {
        this.currentUser = JSON.parse(userString);
        this.isAuthenticated = true;
        return this.currentUser;
      }
      return null;
    } catch {
      return null;
    }
  }

  async isUserAuthenticated(): Promise<boolean> {
    if (this.isAuthenticated) return true;
    
    try {
      const isAuth = await AsyncStorage.getItem('isAuthenticated');
      this.isAuthenticated = isAuth === 'true';
      return this.isAuthenticated;
    } catch {
      return false;
    }
  }

  // User methods
  async updateUser(updates: Partial<User>): Promise<{ user: User; error: null } | { user: null; error: string }> {
    try {
      if (!this.currentUser) throw new Error('No authenticated user');
      
      const updatedUser = {
        ...this.currentUser,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      this.currentUser = updatedUser;

      return { user: updatedUser, error: null };
    } catch (error) {
      return { user: null, error: 'Failed to update user' };
    }
  }

  // Tyre transaction methods
  async getTyreTransactions(userId: string): Promise<TyreTransaction[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_TRANSACTIONS.filter(t => t.userId === userId);
  }

  async addTyreTransaction(transaction: Omit<TyreTransaction, 'id' | 'createdAt'>): Promise<TyreTransaction> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTransaction: TyreTransaction = {
      ...transaction,
      id: `transaction-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Update user's tyre balance
    if (this.currentUser && this.currentUser.id === transaction.userId) {
      const tyreChange = transaction.type === 'earned' ? transaction.amount : -transaction.amount;
      await this.updateUser({ tyres: this.currentUser.tyres + tyreChange });
    }

    return newTransaction;
  }

}

export const supabaseService = new SupabaseService();
export default supabaseService;