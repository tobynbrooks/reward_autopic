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

import TyreProgressBar from '../components/TyreProgressBar';
import ContactUs from '../components/ContactUs';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import {
  formatTyres,
  REDEMPTION_TIERS
} from '../utils/tyreCalculator';
import { User } from '../types';
import { supabaseService } from '../services/supabase';

console.log('App loaded successfully!');

const HomeScreen: React.FC = () => {
  const [currentTyres, setCurrentTyres] = useState(8); // Mock user with 8 tyres
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
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>{getWelcomeMessage()}</Text>
          <Text style={styles.subHeadingText}>You've been collecting like a pro</Text>
        </View>

        {/* Progress Bar Component */}
        <View style={styles.progressSection}>
          <TyreProgressBar currentTyres={currentTyres} />
        </View>

        {/* Contact Us Section */}
        <View style={styles.contactSection}>
          <ContactUs onPress={() => console.log('Contact us pressed')} />
        </View>

        {/* Available Redemptions */}
        <View style={styles.redemptionsCard}>
          <Text style={styles.sectionTitle}>Redemption Tiers</Text>
          {REDEMPTION_TIERS.map((tier, index) => (
            <TouchableOpacity
              key={tier.tyres}
              style={[
                styles.tierRow,
                currentTyres >= tier.tyres ? styles.tierAvailable : styles.tierLocked,
                index === REDEMPTION_TIERS.length - 1 && styles.lastTierRow
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
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  progressSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  contactSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  header: {
    backgroundColor: '#00704A', // Starbucks green
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['2xl'],
    marginBottom: spacing['2xl'],
  },
  welcomeText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subHeadingText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  redemptionsCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    minHeight: 72,
  },
  tierAvailable: {
    backgroundColor: colors.success + '10',
    borderWidth: 2,
    borderColor: colors.success,
  },
  tierLocked: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  tierLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  tierTyres: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tierDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  tierRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  tierAvailableText: {
    fontSize: typography.fontSize.sm,
    color: colors.success,
    fontWeight: typography.fontWeight.semiBold,
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tierLockedText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    fontWeight: typography.fontWeight.medium,
  },
  lastTierRow: {
    marginBottom: 0,
  },
});

export default HomeScreen;