import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../components/Button';
import Input from '../components/Input';
import TyreProgressBar from '../components/TyreProgressBar';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import {
  formatTyres,
  REDEMPTION_TIERS,
  calculateTyresFromSpending
} from '../utils/tyreCalculator';
import { User } from '../types';
import { supabaseService } from '../services/supabase';

console.log('App loaded successfully!');

const HomeScreen: React.FC = () => {
  const [currentTyres, setCurrentTyres] = useState(8); // Mock user with 8 tyres
  const [spendingAmount, setSpendingAmount] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data and determine if it's first login
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await supabaseService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setCurrentTyres(currentUser.tyres);
          
          // Check if this is first login by looking for existing login sessions
          const hasLoggedInBefore = await AsyncStorage.getItem(`hasLoggedIn_${currentUser.id}`);
          if (!hasLoggedInBefore) {
            setIsFirstLogin(true);
            // Mark that user has logged in before
            await AsyncStorage.setItem(`hasLoggedIn_${currentUser.id}`, 'true');
          } else {
            setIsFirstLogin(false);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);


  // Generate personalized welcome message
  const getWelcomeMessage = () => {
    if (isLoading) {
      return '🛞 Welcome to Tyre Rewards';
    }
    
    // Since Supabase isn't linked yet, use dummy name for now
    const userName = user?.name || 'John';
    
    if (isFirstLogin) {
      return `🛞 Welcome, ${userName}!`;
    } else {
      return `🛞 Welcome back, ${userName}!`;
    }
  };

  const handleCalculateEarning = () => {
    const amount = parseFloat(spendingAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid spending amount');
      return;
    }
    
    const newTyres = calculateTyresFromSpending(amount);
    const totalTyres = currentTyres + newTyres;
    
    Alert.alert(
      'Tyres Earned!',
      `Spending £${amount.toFixed(2)} earns ${formatTyres(newTyres)}!\n\nYour new balance: ${formatTyres(totalTyres)}`,
      [
        { text: 'Update Balance', onPress: () => setCurrentTyres(totalTyres) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleRedemption = (tier: typeof REDEMPTION_TIERS[0]) => {
    if (currentTyres >= tier.tyres) {
      Alert.alert(
        'Redeem Tyres',
        `Redeem ${formatTyres(tier.tyres)} for:\n${tier.description}`,
        [
          { 
            text: 'Redeem', 
            onPress: () => {
              setCurrentTyres(currentTyres - tier.tyres);
              Alert.alert('Success!', `${tier.description} applied to your account!`);
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      Alert.alert(
        'Insufficient Tyres',
        `You need ${tier.tyres - currentTyres} more tyres for this reward.`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>{getWelcomeMessage()}</Text>
          <Text style={styles.subHeadingText}>You've been collecting like a pro</Text>

          {/* Progress Bar Component */}
          <TyreProgressBar currentTyres={currentTyres} />
        </View>

        {/* Calculator Section */}
        <View style={styles.calculatorCard}>
          <Text style={styles.sectionTitle}>Tyre Calculator</Text>
          <Text style={styles.calculatorDescription}>
            Calculate how many tyres you'll earn from spending
          </Text>
          
          <Input
            label="Spending Amount (£)"
            placeholder="Enter amount spent"
            value={spendingAmount}
            onChangeText={setSpendingAmount}
            keyboardType="decimal-pad"
          />
          
          <Button
            title="Calculate Tyres"
            onPress={handleCalculateEarning}
            fullWidth
          />
          
          <Text style={styles.calculatorNote}>
            💰 Every £1 spent = 1 tyre earned
          </Text>
        </View>

        {/* Available Redemptions */}
        <View style={styles.redemptionsCard}>
          <Text style={styles.sectionTitle}>Redemption Tiers</Text>
          {REDEMPTION_TIERS.map((tier) => (
            <TouchableOpacity
              key={tier.tyres}
              style={[
                styles.tierRow,
                currentTyres >= tier.tyres ? styles.tierAvailable : styles.tierLocked
              ]}
              onPress={() => handleRedemption(tier)}
            >
              <View style={styles.tierLeft}>
                <Text style={styles.tierTyres}>{formatTyres(tier.tyres)}</Text>
                <Text style={styles.tierDescription}>{tier.description}</Text>
              </View>
              <View style={styles.tierRight}>
                {currentTyres >= tier.tyres ? (
                  <Text style={styles.tierAvailableText}>Available</Text>
                ) : (
                  <Text style={styles.tierLockedText}>
                    Need {tier.tyres - currentTyres}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#00704A', // Starbucks green
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  welcomeText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subHeadingText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  calculatorCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  calculatorDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  calculatorNote: {
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    textAlign: 'center',
    marginTop: spacing.md,
    fontWeight: typography.fontWeight.medium,
  },
  redemptionsCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    marginTop: 0,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  tierAvailable: {
    backgroundColor: colors.success + '15',
    borderWidth: 1,
    borderColor: colors.success,
  },
  tierLocked: {
    backgroundColor: colors.gray100,
  },
  tierLeft: {
    flex: 1,
  },
  tierTyres: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tierDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  tierRight: {
    alignItems: 'flex-end',
  },
  tierAvailableText: {
    fontSize: typography.fontSize.sm,
    color: colors.success,
    fontWeight: typography.fontWeight.medium,
  },
  tierLockedText: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
});

export default HomeScreen;