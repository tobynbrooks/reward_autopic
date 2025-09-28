import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import { REDEMPTION_TIERS, formatTyres, formatCurrency } from '../utils/tyreCalculator';

const RewardsScreen: React.FC = () => {
  const userTyres = 8; // Mock user balance

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎁 Rewards</Text>
        <Text style={styles.subtitle}>Redeem your tyres for great offers</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceText}>
            Available: {formatTyres(userTyres)} ({formatCurrency(userTyres)})
          </Text>
        </View>

        {/* Redemption Tiers */}
        <View style={styles.tiersContainer}>
          {REDEMPTION_TIERS.map((tier) => (
            <TouchableOpacity
              key={tier.tyres}
              style={[
                styles.tierCard,
                userTyres >= tier.tyres ? styles.tierAvailable : styles.tierLocked
              ]}
            >
              <View style={styles.tierHeader}>
                <Text style={styles.tierTyres}>{formatTyres(tier.tyres)}</Text>
                <Text style={styles.tierValue}>{formatCurrency(tier.tyres)}</Text>
              </View>
              <Text style={styles.tierDescription}>{tier.description}</Text>
              <View style={styles.tierFooter}>
                {userTyres >= tier.tyres ? (
                  <Text style={styles.tierAvailableText}>✅ Available to redeem</Text>
                ) : (
                  <Text style={styles.tierLockedText}>
                    🔒 Need {tier.tyres - userTyres} more tyres
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to Redeem</Text>
          <Text style={styles.infoText}>
            • Visit our service center{'\n'}
            • Show this app to staff{'\n'}
            • Choose your reward{'\n'}
            • Enjoy your savings!
          </Text>
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
  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    backgroundColor: colors.accent,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  balanceText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },
  tiersContainer: {
    paddingHorizontal: spacing.md,
  },
  tierCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  tierAvailable: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  tierLocked: {
    opacity: 0.7,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tierTyres: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  tierValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accent,
  },
  tierDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  tierFooter: {
    alignItems: 'center',
  },
  tierAvailableText: {
    fontSize: typography.fontSize.sm,
    color: colors.success,
    fontWeight: typography.fontWeight.medium,
  },
  tierLockedText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
  infoCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  infoTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});

export default RewardsScreen;