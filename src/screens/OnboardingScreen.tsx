import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import Banner from '../components/Banner';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingData {
  name: string;
  email: string;
  carRegistration: string;
  notificationsEnabled: boolean;
}

const OnboardingScreen: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    email: '',
    carRegistration: '',
    notificationsEnabled: true,
  });
  const { completeOnboarding } = useAuth();

  const handleNext = () => {
    if (step === 1 && !data.name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    if (step === 2 && !data.email.trim()) {
      Alert.alert('Required', 'Please enter your email');
      return;
    }
    if (step === 3 && !data.carRegistration.trim()) {
      Alert.alert('Required', 'Please enter your car registration');
      return;
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    Alert.alert(
      'Welcome!',
      'Your account has been created successfully. You can now start earning tyres!',
      [{ text: 'Get Started', onPress: () => {
        completeOnboarding(); // This will set hasCompletedOnboarding to true and navigate to main app
      }}]
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your name?</Text>
            <Text style={styles.stepDescription}>
              We'll use this to personalize your experience
            </Text>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={data.name}
              onChangeText={(name) => setData({ ...data, name })}
              autoFocus
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your email?</Text>
            <Text style={styles.stepDescription}>
              We'll send you updates about your tyres and rewards
            </Text>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={data.email}
              onChangeText={(email) => setData({ ...data, email })}
              keyboardType="email-address"
              autoFocus
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your car registration?</Text>
            <Text style={styles.stepDescription}>
              This helps us track your service history and tyres
            </Text>
            <Input
              label="Car Registration"
              placeholder="e.g., AB12 CDE"
              value={data.carRegistration}
              onChangeText={(carRegistration) => setData({ ...data, carRegistration })}
              autoCapitalize="characters"
              autoFocus
            />
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Our goal is to keep you driving safely, and for less money.</Text>
            <Text style={styles.stepDescription}>
              We wont bombard you.
            </Text>
            <View style={styles.notificationCard}>
              <Text style={styles.notificationTitle}>🔔 Enable Notifications</Text>
              <Text style={styles.notificationText}>
                • Tyre earning alerts{'\n'}
                • Reward redemption updates{'\n'}
                • Special offers and discounts{'\n'}
                • Service reminders
              </Text>
              <View style={styles.notificationButtons}>
                <Button
                  title="Enable Notifications"
                  onPress={() => setData({ ...data, notificationsEnabled: true })}
                  variant={data.notificationsEnabled ? 'primary' : 'secondary'}
                  style={styles.notificationButton}
                />
                <Button
                  title="Maybe Later"
                  onPress={() => setData({ ...data, notificationsEnabled: false })}
                  variant={!data.notificationsEnabled ? 'primary' : 'secondary'}
                  style={styles.notificationButton}
                />
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Banner currentStep={step} totalSteps={4} />

      {/* Content */}
      <View style={styles.content}>
        {renderStep()}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        {step > 1 && (
          <Button
            title="Back"
            onPress={handleBack}
            variant="secondary"
            style={styles.navButton}
          />
        )}
        <Button
          title={step === 4 ? 'Complete Setup' : 'Next'}
          onPress={handleNext}
          variant="primary"
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  notificationCard: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  notificationTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  notificationText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  notificationButtons: {
    width: '100%',
  },
  notificationButton: {
    marginBottom: spacing.sm,
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  nextButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
    marginLeft: spacing.sm,
  },
});

export default OnboardingScreen;