// Tyre Calculator Helper Functions
// 1 tyre = £1 credit, minimum 5 tyres for redemption

export interface TyreCalculation {
  tyres: number;
  creditValue: number;
  canRedeem: boolean;
  nextRedemptionTyres: number;
  remainingToRedeem: number;
}

export interface RedemptionTier {
  tyres: number;
  discount: number;
  description: string;
}

// Redemption tiers (Starbucks-inspired)
export const REDEMPTION_TIERS: RedemptionTier[] = [
  { tyres: 5, discount: 5, description: '£5 off service' },
  { tyres: 10, discount: 12, description: '£12 off service + free check' },
  { tyres: 15, discount: 20, description: '£20 off service + priority booking' },
  { tyres: 25, discount: 35, description: '£35 off service + free MOT' },
  { tyres: 50, discount: 75, description: '£75 off service + VIP benefits' },
];

export const MINIMUM_REDEMPTION_TYRES = 5;
export const TYRE_TO_POUND_RATIO = 1; // 1 tyre = £1

/**
 * Calculate tyre value and redemption status
 */
export function calculateTyreValue(tyres: number): TyreCalculation {
  const creditValue = tyres * TYRE_TO_POUND_RATIO;
  const canRedeem = tyres >= MINIMUM_REDEMPTION_TYRES;
  const remainingToRedeem = canRedeem ? 0 : MINIMUM_REDEMPTION_TYRES - tyres;
  
  // Find next redemption milestone
  const nextTier = REDEMPTION_TIERS.find(tier => tier.tyres > tyres);
  const nextRedemptionTyres = nextTier ? nextTier.tyres : REDEMPTION_TIERS[REDEMPTION_TIERS.length - 1].tyres;

  return {
    tyres,
    creditValue,
    canRedeem,
    nextRedemptionTyres,
    remainingToRedeem,
  };
}

/**
 * Get available redemption options for current tyre count
 */
export function getAvailableRedemptions(tyres: number): RedemptionTier[] {
  return REDEMPTION_TIERS.filter(tier => tyres >= tier.tyres);
}

/**
 * Get next redemption tier
 */
export function getNextRedemptionTier(tyres: number): RedemptionTier | null {
  return REDEMPTION_TIERS.find(tier => tier.tyres > tyres) || null;
}

/**
 * Calculate progress to next tier (percentage)
 */
export function calculateProgressToNextTier(tyres: number): number {
  const nextTier = getNextRedemptionTier(tyres);
  if (!nextTier) return 100; // Already at max tier
  
  const previousTier = REDEMPTION_TIERS.find(tier => tier.tyres <= tyres);
  const previousTyres = previousTier ? previousTier.tyres : 0;
  
  const progressTyres = tyres - previousTyres;
  const totalTyresForTier = nextTier.tyres - previousTyres;
  
  return Math.min(100, (progressTyres / totalTyresForTier) * 100);
}

/**
 * Calculate how many tyres are earned from spending
 */
export function calculateTyresFromSpending(amountSpent: number): number {
  return Math.floor(amountSpent); // 1 tyre per £1 spent
}

/**
 * Format tyres for display
 */
export function formatTyres(tyres: number, showSingular = true): string {
  if (tyres === 1 && showSingular) {
    return '1 tyre';
  }
  return `${tyres} tyres`;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

/**
 * Get tier description for current tyre count
 */
export function getCurrentTierDescription(tyres: number): string {
  if (tyres < MINIMUM_REDEMPTION_TYRES) {
    return `Collect ${MINIMUM_REDEMPTION_TYRES - tyres} more tyres to start redeeming`;
  }
  
  const currentTier = getAvailableRedemptions(tyres).pop();
  return currentTier ? currentTier.description : 'No tier available';
}

/**
 * Validate tyre transaction amount
 */
export function validateTyreAmount(amount: number, type: 'earned' | 'redeemed'): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  
  if (type === 'earned' && amount > 1000) {
    return { valid: false, error: 'Cannot earn more than 1000 tyres in a single transaction' };
  }
  
  if (type === 'redeemed' && amount < MINIMUM_REDEMPTION_TYRES) {
    return { valid: false, error: `Minimum redemption is ${MINIMUM_REDEMPTION_TYRES} tyres` };
  }
  
  return { valid: true };
}