import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import { 
  calculateTyreValue, 
  formatTyres, 
  formatCurrency,
  REDEMPTION_TIERS,
  calculateTyresFromSpending 
} from '../utils/tyreCalculator';

const HomeScreen: React.FC = () => {
  const [currentTyres, setCurrentTyres] = useState(8); // Mock user with 8 tyres
  const [spendingAmount, setSpendingAmount] = useState('');

  const calculation = calculateTyreValue(currentTyres);

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
      `Spending £${amount.toFixed(2)} earns ${formatTyres(newTyres)}!\n\nYour new balance: ${formatTyres(totalTyres)} (${formatCurrency(totalTyres)})`,
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
        {/* Balance Widget */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Your Tyre Balance</Text>
          <View style={styles.balanceRow}>
            <View style={styles.tyreDisplay}>
              <Text style={styles.tyreIcon}>🏎️</Text>
              <Text style={styles.tyreCount}>{currentTyres}</Text>
              <Text style={styles.tyreLabel}>{currentTyres === 1 ? 'Tyre' : 'Tyres'}</Text>
            </View>
            <View style={styles.creditDisplay}>
              <Text style={styles.creditValue}>{formatCurrency(calculation.creditValue)}</Text>
              <Text style={styles.creditLabel}>Credit Value</Text>
            </View>
          </View>
          
          <View style={styles.statusRow}>
            {calculation.canRedeem ? (
              <Text style={styles.canRedeemText}>✅ You can redeem rewards!</Text>
            ) : (
              <Text style={styles.cantRedeemText}>
                Need {calculation.remainingToRedeem} more tyres to redeem
              </Text>
            )}
          </View>
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
  balanceCard: {
    backgroundColor: colors.primary,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  balanceTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  tyreDisplay: {
    alignItems: 'center',
  },
  tyreIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  tyreCount: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  tyreLabel: {
    fontSize: typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  creditDisplay: {
    alignItems: 'center',
  },
  creditValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
  },
  creditLabel: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusRow: {
    alignItems: 'center',
  },
  canRedeemText: {
    fontSize: typography.fontSize.base,
    color: colors.accent,
    fontWeight: typography.fontWeight.medium,
  },
  cantRedeemText: {
    fontSize: typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.9)',
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