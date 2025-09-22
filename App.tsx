import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';

// Import our tyre calculator logic
import { 
  calculateTyreValue, 
  formatTyres, 
  formatCurrency,
  REDEMPTION_TIERS,
  calculateTyresFromSpending 
} from './reward-app/src/utils/tyreCalculator';

export default function App() {
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
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏎️ Tyre Rewards</Text>
        <Text style={styles.subtitle}>Your automotive rewards app</Text>
      </View>

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
        
        <TextInput
          style={styles.input}
          placeholder="Enter amount spent (£)"
          value={spendingAmount}
          onChangeText={setSpendingAmount}
          keyboardType="decimal-pad"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleCalculateEarning}>
          <Text style={styles.buttonText}>Calculate Tyres</Text>
        </TouchableOpacity>
        
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#00704A',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  balanceCard: {
    backgroundColor: '#00704A',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tyreDisplay: {
    alignItems: 'center',
  },
  tyreIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  tyreCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tyreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  creditDisplay: {
    alignItems: 'center',
  },
  creditValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  creditLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusRow: {
    alignItems: 'center',
  },
  canRedeemText: {
    fontSize: 16,
    color: '#D4AF37',
    fontWeight: '500',
  },
  cantRedeemText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  calculatorCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  calculatorDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#00704A',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  calculatorNote: {
    fontSize: 14,
    color: '#D4AF37',
    textAlign: 'center',
    fontWeight: '500',
  },
  redemptionsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  tierAvailable: {
    backgroundColor: 'rgba(0, 166, 81, 0.1)',
    borderWidth: 1,
    borderColor: '#00A651',
  },
  tierLocked: {
    backgroundColor: '#F3F4F6',
  },
  tierLeft: {
    flex: 1,
  },
  tierTyres: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  tierDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  tierRight: {
    alignItems: 'flex-end',
  },
  tierAvailableText: {
    fontSize: 14,
    color: '#00A651',
    fontWeight: '500',
  },
  tierLockedText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});