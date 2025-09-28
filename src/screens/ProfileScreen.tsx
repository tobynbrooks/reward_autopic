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
  calculateTyresFromSpending
} from '../utils/tyreCalculator';

const ProfileScreen: React.FC = () => {
  const [spendingAmount, setSpendingAmount] = useState('');
  const [userInfo] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    carRegistration: 'AB12 CDE',
    tyres: 8,
    memberSince: 'January 2024',
  });

  const calculation = calculateTyreValue(userInfo.tyres);

  const handleCalculateEarning = () => {
    const amount = parseFloat(spendingAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid spending amount');
      return;
    }

    const newTyres = calculateTyresFromSpending(amount);
    const totalTyres = userInfo.tyres + newTyres;

    Alert.alert(
      'Tyres Calculator Result',
      `Spending £${amount.toFixed(2)} would earn ${formatTyres(newTyres)}\n\nYour new balance would be: ${formatTyres(totalTyres)} (${formatCurrency(totalTyres)})`,
      [{ text: 'OK' }]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!', [{ text: 'OK' }]);
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings coming soon!', [{ text: 'OK' }]);
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact us at support@tyrerewards.com', [{ text: 'OK' }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Profile</Text>
        <Text style={styles.subtitle}>Manage your account</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.userEmail}>{userInfo.email}</Text>
          <Text style={styles.memberSince}>Member since {userInfo.memberSince}</Text>

          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceValue}>{formatTyres(userInfo.tyres)}</Text>
              <Text style={styles.balanceLabel}>Current Balance</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceValue}>{formatCurrency(userInfo.tyres)}</Text>
              <Text style={styles.balanceLabel}>Credit Value</Text>
            </View>
          </View>
        </View>

        {/* Car Details */}
        <View style={styles.carCard}>
          <Text style={styles.cardTitle}>🚗 Vehicle Information</Text>
          <View style={styles.carRow}>
            <Text style={styles.carLabel}>Registration:</Text>
            <Text style={styles.carValue}>{userInfo.carRegistration}</Text>
          </View>
        </View>

        {/* Tyre Calculator */}
        <View style={styles.calculatorCard}>
          <Text style={styles.cardTitle}>🧮 Tyre Calculator</Text>
          <Text style={styles.calculatorDescription}>
            Calculate potential tyres from spending
          </Text>

          <Input
            label="Spending Amount (£)"
            placeholder="Enter amount"
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
            💰 £1 spent = 1 tyre earned
          </Text>
        </View>

        {/* Account Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>⚙️ Account Settings</Text>

          <TouchableOpacity style={styles.actionRow} onPress={handleEditProfile}>
            <Text style={styles.actionText}>Edit Profile</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={handleNotifications}>
            <Text style={styles.actionText}>Notifications</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={handleSupport}>
            <Text style={styles.actionText}>Support & Help</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <Text style={styles.appVersion}>Tyre Rewards v1.0.0</Text>
          <Text style={styles.appDescription}>
            Earn tyres with every pound spent. Redeem for great rewards and savings!
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
  userCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    fontSize: 40,
    color: colors.white,
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  memberSince: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.lg,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  balanceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
  carCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  carRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carLabel: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  carValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },
  calculatorCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
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
  actionsCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  actionArrow: {
    fontSize: typography.fontSize.lg,
    color: colors.textTertiary,
  },
  infoCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    marginTop: 0,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  appVersion: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  appDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ProfileScreen;