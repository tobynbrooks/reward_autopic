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

// Single source of truth for all tyre tiers - used for progress, rewards, and spreadsheet
export interface TyreTier {
  tyres: number;
  label: string;
  color: string;
  reward: string;
  discount: number;
  description: string;
}

export const TYRE_TIERS: TyreTier[] = [
  { tyres: 0, label: 'Welcome', color: '#D1D5DB', reward: 'Start earning!', discount: 0, description: 'Welcome to Tyre Rewards' },
  { tyres: 5, label: 'Bronze', color: '#CD7F32', reward: '£5 off service', discount: 5, description: '£5 off service' },
  { tyres: 10, label: 'Silver', color: '#C0C0C0', reward: '£12 off + free check', discount: 12, description: '£12 off service + free check' },
  { tyres: 15, label: 'Gold', color: '#FFD700', reward: '£20 off + priority', discount: 20, description: '£20 off service + priority booking' },
  { tyres: 25, label: 'Platinum', color: '#E5E4E2', reward: '£35 off + free MOT', discount: 35, description: '£35 off service + free MOT' },
  { tyres: 50, label: 'VIP', color: '#50C878', reward: '£75 off + VIP benefits', discount: 75, description: '£75 off service + VIP benefits' },
];

// Backward compatibility - can be removed later
export const REDEMPTION_TIERS = TYRE_TIERS.filter(tier => tier.tyres > 0).map(tier => ({
  tyres: tier.tyres,
  discount: tier.discount,
  description: tier.description
}));

export const MINIMUM_REDEMPTION_TYRES = 5;
export const TYRE_TO_POUND_RATIO = 1; // 1 tyre = £1

// Progress calculation functions
export interface ProgressData {
  currentTier: TyreTier;
  nextTier: TyreTier | null;
  progressToNext: number;
  tyresNeeded: number;
  isMaxTier: boolean;
}

export function getCurrentTier(currentTyres: number): TyreTier {
  for (let i = TYRE_TIERS.length - 1; i >= 0; i--) {
    if (currentTyres >= TYRE_TIERS[i].tyres) {
      return TYRE_TIERS[i];
    }
  }
  return TYRE_TIERS[0];
}

export function getNextTier(currentTyres: number): TyreTier | null {
  const currentTier = getCurrentTier(currentTyres);
  const currentIndex = TYRE_TIERS.findIndex(tier => tier.tyres === currentTier.tyres);
  return currentIndex < TYRE_TIERS.length - 1 ? TYRE_TIERS[currentIndex + 1] : null;
}

export function calculateProgress(currentTyres: number): ProgressData {
  const currentTier = getCurrentTier(currentTyres);
  const nextTier = getNextTier(currentTyres);
  const isMaxTier = !nextTier;
  
  let progressToNext = 0;
  let tyresNeeded = 0;
  
  if (nextTier) {
    const tyresInCurrentTier = currentTyres - currentTier.tyres;
    const tyresNeededForNext = nextTier.tyres - currentTier.tyres;
    progressToNext = Math.min(100, (tyresInCurrentTier / tyresNeededForNext) * 100);
    tyresNeeded = nextTier.tyres - currentTyres;
  } else {
    progressToNext = 100;
  }

  return {
    currentTier,
    nextTier,
    progressToNext,
    tyresNeeded,
    isMaxTier,
  };
}

// Spreadsheet export functions
export function getTiersForSpreadsheet() {
  return TYRE_TIERS.map(tier => ({
    'Tier': tier.label,
    'Tyres Required': tier.tyres,
    'Reward': tier.reward,
    'Discount Amount': `£${tier.discount}`,
    'Description': tier.description,
    'Color Code': tier.color,
  }));
}

export function exportTiersAsCSV(): string {
  const headers = ['Tier', 'Tyres Required', 'Reward', 'Discount Amount', 'Description', 'Color Code'];
  const rows = TYRE_TIERS.map(tier => [
    tier.label,
    tier.tyres.toString(),
    tier.reward,
    `£${tier.discount}`,
    tier.description,
    tier.color
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

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