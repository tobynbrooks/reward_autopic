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
  
  // Animation setup
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate progress counter
    Animated.timing(animatedValue, {
      toValue: currentTyres,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });

    // Pulse animation for milestones
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [currentTyres, animatedValue]);

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, MAX_TYRES],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.tileContainer}>
      <View style={styles.container}>
        {/* Clean Header */}
        <View style={styles.header}>
          <View style={styles.tierBadge}>
            <Text style={styles.tierLabel}>{progress.currentTier.label}</Text>
          </View>
          <Text style={styles.progressValue}>{displayValue} / {MAX_TYRES}</Text>
        </View>

      {/* Segmented Progress Track */}
      <View style={styles.segmentedTrack}>
        {/* Background segments */}
        {MILESTONES.map((milestone, index) => {
          const segmentWidth = index === 0 ? milestone : milestone - MILESTONES[index - 1];
          const widthPercentage = (segmentWidth / MAX_TYRES) * 100;
          const isCompleted = currentTyres >= milestone;
          
          return (
            <View 
              key={`segment-${index}`}
              style={[
                styles.segment,
                { 
                  width: `${widthPercentage}%`,
                  backgroundColor: isCompleted ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  marginRight: index < MILESTONES.length - 1 ? 2 : 0,
                }
              ]} 
            />
          );
        })}
        
        {/* Animated gradient overlay */}
        <Animated.View style={[styles.progressOverlay, { width: progressWidth }]}>
          <LinearGradient
            colors={['#FFD700', '#FFA500', '#FF8C00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressGradient}
          />
        </Animated.View>
      </View>

      {/* Clean milestone dots (replaces the complex milestone circles and labels) */}
      <View style={styles.milestoneIndicators}>
        {MILESTONES.map((milestone, index) => {
          const isCompleted = currentTyres >= milestone;
          const isCurrent = currentTyres < milestone && (index === 0 || currentTyres >= MILESTONES[index - 1]);
          
          return (
            <Animated.View 
              key={`indicator-${index}`} 
              style={[
                styles.milestoneContainer,
                { transform: [{ scale: isCurrent ? scaleAnim : 1 }] }
              ]}
            >
              <View style={[
                styles.milestoneDot,
                {
                  backgroundColor: isCompleted ? '#FFD700' : isCurrent ? '#60A5FA' : 'rgba(255, 255, 255, 0.3)',
                  shadowColor: isCompleted ? '#FFD700' : 'transparent',
                  shadowOpacity: isCompleted ? 0.4 : 0,
                }
              ]} />
            </Animated.View>
          );
        })}
      </View>

      {/* Simple status text (replaces complex footer) */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {progress.nextTier 
            ? `${progress.tyresNeeded} more tyres for ${progress.nextTier.label}` 
            : '🏆 Maximum tier reached!'}
        </Text>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tileContainer: {
    backgroundColor: '#00704A', // Same green as header banner
    margin: spacing.md,
    marginTop: 0,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  container: {
    position: 'relative',
    backgroundColor: 'rgba(0, 112, 74, 0.05)',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 112, 74, 0.1)',
  },
  
  // Clean Header
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
  progressValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },

  // Segmented Progress Track
  segmentedTrack: {
    height: 12,
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  segment: {
    height: '100%',
    borderRadius: 6,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressGradient: {
    width: '100%',
    height: '100%',
  },

  // Clean milestone indicators (replaces complex milestone circles)
  milestoneIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingHorizontal: 4,
  },
  milestoneContainer: {
    alignItems: 'center',
  },
  milestoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  // Simple status (replaces complex footer)
  statusContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});

export default TyreProgressBar;