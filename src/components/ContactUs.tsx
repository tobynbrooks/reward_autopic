import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

interface ContactUsProps {
  onPress?: () => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Main text */}
      <Text style={styles.mainText}>Book in and redeem your points</Text>
      
      {/* Inner card */}
      <View style={styles.innerCard}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Text style={styles.iconText}>📞</Text>
          </View>
        </View>
        
        {/* Text content */}
        <View style={styles.textContainer}>
          <Text style={styles.appName}>WhatsUp</Text>
          <Text style={styles.availability}>Available Mon-Fri • 9-17</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary, // Use app's primary green
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  mainText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textOnPrimary, // Use white text for better contrast on green background
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  innerCard: {
    backgroundColor: colors.secondary, // Use app's secondary green
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  iconBackground: {
    width: 40,
    height: 40,
    backgroundColor: '#000000', // Black background for icon
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    color: '#FFFFFF', // White icon
  },
  textContainer: {
    flex: 1,
  },
  appName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary, // Use theme's primary text color
    marginBottom: spacing.xs,
  },
  availability: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary, // Use theme's secondary text color
    fontWeight: typography.fontWeight.normal,
  },
});

export default ContactUs;
