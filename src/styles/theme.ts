// Starbucks-inspired theme for the rewards app
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Starbucks color palette
export const colors = {
  // Primary Starbucks green
  primary: '#00704A',
  primaryLight: '#1E3932',
  primaryDark: '#004C33',
  
  // Secondary green
  secondary: '#F1F8F6',
  secondaryLight: '#F7FBFA',
  
  // Accent colors
  accent: '#D4AF37', // Gold for rewards/tyres
  accentLight: '#F4E7B8',
  
  // Status colors
  success: '#00A651',
  warning: '#F2A900',
  error: '#D73027',
  info: '#0078D4',
  
  // Neutral colors
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F1F8F6',
  
  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#1F2937',
  
  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderFocus: '#00704A',
  
  // Card colors
  cardBackground: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  
  // Tyre/reward specific colors
  tyreGold: '#D4AF37',
  tyreBackground: '#F4E7B8',
  rewardGreen: '#00A651',
  rewardBackground: '#E8F5E8',
};

export const typography = {
  // Font families (using system fonts for Expo compatibility)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
};

export const layout = {
  screen: {
    width,
    height,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  container: {
    maxWidth: 400,
    paddingHorizontal: spacing.md,
  },
  // Standard card layout with consistent padding
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.cardBackground,
    ...shadows.md,
  },
  // Compact card for nested items
  cardCompact: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.cardBackground,
    ...shadows.sm,
  },
  // Section spacing - use this for consistent gaps between major sections
  section: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  // Header section
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    marginBottom: spacing.lg,
  },
  button: {
    height: 48,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
  },
  input: {
    height: 48,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
  },
};

// Component-specific styles
export const components = {
  // Button variants
  button: {
    primary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.white,
      borderColor: colors.primary,
      borderWidth: 1,
    },
    accent: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
  },
  
  // Input variants
  input: {
    default: {
      backgroundColor: colors.white,
      borderColor: colors.border,
      color: colors.textPrimary,
    },
    focused: {
      borderColor: colors.borderFocus,
      borderWidth: 2,
    },
    error: {
      borderColor: colors.error,
      borderWidth: 1,
    },
  },
  
  // Card variants
  card: {
    default: {
      backgroundColor: colors.cardBackground,
      ...shadows.md,
    },
    elevated: {
      backgroundColor: colors.cardBackground,
      ...shadows.lg,
    },
    tyre: {
      backgroundColor: colors.tyreBackground,
      borderColor: colors.tyreGold,
      borderWidth: 1,
    },
    reward: {
      backgroundColor: colors.rewardBackground,
      borderColor: colors.rewardGreen,
      borderWidth: 1,
    },
  },
};

// Utility functions
export const getResponsivePadding = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const basePadding = {
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
  };
  
  return {
    paddingHorizontal: Math.min(basePadding[size], width * 0.05),
    paddingVertical: basePadding[size],
  };
};

export const getResponsiveFontSize = (size: keyof typeof typography.fontSize) => {
  return Math.min(typography.fontSize[size], width * 0.08);
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  components,
  getResponsivePadding,
  getResponsiveFontSize,
};