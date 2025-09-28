import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

interface BannerProps {
  currentStep: number;
  totalSteps: number;
}

const Banner: React.FC<BannerProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Autopic</Text>
      <Text style={styles.subtitle}>by Best Autocentres</Text>
      
      {/* Progress indicators */}
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index < currentStep ? styles.progressDotActive : styles.progressDotInactive
            ]}
          />
        ))}
      </View>
      
      <Text style={styles.stepCounter}>Step {currentStep} of {totalSteps}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary, // Using green-800 equivalent
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)', // text-gray-200 equivalent
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  progressDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginHorizontal: spacing.xs,
  },
  progressDotActive: {
    backgroundColor: colors.accent, // Using yellow-500 equivalent
  },
  progressDotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepCounter: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default Banner;
