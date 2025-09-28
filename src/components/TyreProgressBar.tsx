import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import { calculateProgress, TYRE_TIERS } from '../utils/tyreCalculator';

interface TyreProgressBarProps {
  currentTyres: number;
}

// Auto-generate milestones from tiers (easy to modify by editing TYRE_TIERS)
const MILESTONES = TYRE_TIERS.filter(tier => tier.tyres > 0).map(tier => tier.tyres);
const MAX_TYRES = Math.max(...TYRE_TIERS.map(tier => tier.tyres)); // Auto-calculate max

const TyreProgressBar: React.FC<TyreProgressBarProps> = ({ currentTyres }) => {
  const progress = calculateProgress(currentTyres);
  const progressPercentage = Math.min(100, (currentTyres / MAX_TYRES) * 100);
  
  // Animation setup - separate values for different purposes
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate progress bar with native driver (for better performance)
    Animated.timing(animatedValue, {
      toValue: progressPercentage,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Animate counter with a separate animation (non-native)
    const counterAnimation = new Animated.Value(0);
    Animated.timing(counterAnimation, {
      toValue: progressPercentage,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    const listener = counterAnimation.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });

    // Pulse animation for current tier
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse for progress fill
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      counterAnimation.removeListener(listener);
    };
  }, [progressPercentage, currentTyres]);

  const progressScale = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Header with current tier and progress */}
      <View style={styles.header}>
        <View style={styles.tierBadge}>
          <Text style={styles.tierLabel}>{progress.currentTier.label}</Text>
        </View>
        <Text style={styles.progressPercentage}>{displayValue}%</Text>
      </View>

      {/* Modern Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[
            styles.progressFillContainer, 
            { 
              transform: [
                { scaleX: progressScale },
                { scaleY: pulseAnim }
              ]
            }
          ]}>
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FF8C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressFill}
            />
            {/* Glow effect */}
            <View style={styles.progressGlow} />
          </Animated.View>
        </View>

        {/* Milestones */}
        <View style={styles.milestones}>
          {MILESTONES.map((milestone, index) => {
            const isReached = currentTyres >= milestone;
            const position = (milestone / MAX_TYRES) * 100;
            
            return (
              <Animated.View 
                key={index} 
                style={[
                  styles.milestone, 
                  { 
                    left: `${position}%`,
                    transform: [{ scale: isReached ? scaleAnim : 1 }]
                  }
                ]}
              >
                <View style={[
                  styles.milestoneCircle,
                  {
                    backgroundColor: isReached ? '#FFD700' : 'rgba(255, 255, 255, 0.3)',
                    borderColor: isReached ? '#FFD700' : 'rgba(255, 255, 255, 0.5)',
                    shadowColor: isReached ? '#FFD700' : 'transparent',
                  }
                ]} />
                <Text style={styles.milestoneLabel}>{milestone}</Text>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Current Position Indicator */}
      <Animated.View style={[
        styles.currentIndicator,
        { 
          left: `${Math.max(0, Math.min(100, progressPercentage))}%`,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <View style={styles.indicatorTriangle} />
        <View style={styles.indicatorBadge}>
          <Text style={styles.indicatorText}>{currentTyres}</Text>
        </View>
      </Animated.View>

      {/* Status Footer */}
      <View style={styles.footer}>
        <View style={styles.currentStatus}>
          <Text style={styles.tyreCount}>{currentTyres}</Text>
          <Text style={styles.tyreLabel}>Tyres Collected</Text>
        </View>

        <View style={styles.nextTierInfo}>
          <Text style={styles.nextTierText}>
            {progress.nextTier
              ? `${progress.tyresNeeded} more for ${progress.nextTier.label}`
              : '🏆 Maximum tier reached!'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...shadows.lg,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  tierBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  tierLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressPercentage: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },

  // Progress Bar
  progressContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  progressTrack: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressFillContainer: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    transformOrigin: 'left center',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 8,
    opacity: 0.6,
  },

  // Milestones
  milestones: {
    position: 'relative',
    height: 60,
    marginTop: spacing.md,
  },
  milestone: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -12 }],
  },
  milestoneCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    marginBottom: spacing.xs,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  milestoneLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    fontWeight: typography.fontWeight.semiBold,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  // Current Indicator
  currentIndicator: {
    position: 'absolute',
    alignItems: 'center',
    top: -60,
    transform: [{ translateX: -20 }],
  },
  indicatorTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFD700',
    marginBottom: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  indicatorBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  indicatorText: {
    fontSize: typography.fontSize.sm,
    color: '#1F2937',
    fontWeight: typography.fontWeight.bold,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentStatus: {
    alignItems: 'center',
  },
  tyreCount: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  tyreLabel: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  nextTierInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  nextTierText: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: typography.fontWeight.medium,
  },
});

export default TyreProgressBar;
