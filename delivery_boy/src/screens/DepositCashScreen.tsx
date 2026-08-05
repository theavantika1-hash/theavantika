import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface DepositCashScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: 'profile' | 'orders' | 'deposit' | 'account') => void;
  onNavigateToNotifications?: () => void;
  onNavigateToTransactions?: () => void;
  cashInHand?: string;
  availableBalance?: string;
  cashLimit?: string;
}

export function DepositCashScreen({
  onBack,
  onNavigateTab,
  onNavigateToNotifications,
  onNavigateToTransactions,
  cashInHand = '$540',
  availableBalance = '$210',
  cashLimit = '$750',
}: DepositCashScreenProps) {
  const insets = useSafeAreaInsets();

  const handleSelectOption = (optionName: string) => {
    Alert.alert(optionName, `Opening ${optionName} payment gateway...`);
  };

  const handleSeeAllTransactions = () => {
    if (onNavigateToTransactions) {
      onNavigateToTransactions();
    } else {
      Alert.alert('Recent Transactions', 'Showing all past deposit transactions...');
    }
  };

  return (
    <View style={depositStyles.container}>
      {/* 1. TOP CURVED TEAL HEADER (#4CA687) */}
      <View style={[depositStyles.topHeader, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={depositStyles.headerTopRow}>
          <View style={depositStyles.brandRow}>
            <TouchableOpacity style={depositStyles.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
              <Text style={depositStyles.headerBackArrow}>←</Text>
            </TouchableOpacity>
            <View style={depositStyles.utensilCircle}>
              <Text style={{ fontSize: 16 }}>🍴</Text>
            </View>
            <Text style={depositStyles.brandTitle}>Food Love</Text>
          </View>

          <TouchableOpacity
            style={depositStyles.bellTouch}
            onPress={() => {
              if (onNavigateToNotifications) onNavigateToNotifications();
            }}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 20 }}>🔔</Text>
            <View style={depositStyles.bellBadge}>
              <Text style={depositStyles.bellBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={depositStyles.headerTitleRow}>
          <Text style={depositStyles.headerTitleText}>Deposit Cash</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          depositStyles.scrollContent,
          { paddingBottom: 110 },
        ]}
      >
        {/* 2. CASH IN HAND & AVAILABLE BALANCE ROWS */}
        <View style={depositStyles.balanceSection}>
          <View style={depositStyles.balanceRow}>
            <Text style={depositStyles.balanceLabelText}>Cash in Hand</Text>
            <Text style={depositStyles.balanceAmountTeal}>{cashInHand}</Text>
          </View>

          <View style={depositStyles.dividerLine} />

          <View style={depositStyles.balanceRow}>
            <Text style={depositStyles.balanceLabelText}>Available Balance</Text>
            <Text style={depositStyles.balanceAmountTeal}>{availableBalance}</Text>
          </View>
        </View>

        {/* 3. CASH LIMIT PROGRESS CARD */}
        <View style={depositStyles.limitCardWrapper}>
          <View style={depositStyles.limitCard}>
            <View style={depositStyles.limitHeaderRow}>
              <Text style={depositStyles.limitTitleText}>Cash Limit</Text>
              <Text style={depositStyles.limitAmountTeal}>{cashLimit}</Text>
            </View>

            {/* Progress Bar Container */}
            <View style={depositStyles.progressBarTrack}>
              <View style={[depositStyles.progressBarFill, { width: '70%' }]} />
            </View>
          </View>
        </View>

        <View style={depositStyles.dividerLineFull} />

        {/* 4. CHOOSE DEPOSIT OPTION SECTION */}
        <View style={depositStyles.sectionContainer}>
          <Text style={depositStyles.sectionTitleText}>Choose Deposit Option</Text>

          {/* Option 1: G Pay (UPI) */}
          <TouchableOpacity
            style={depositStyles.optionItemRow}
            onPress={() => handleSelectOption('Google Pay UPI')}
            activeOpacity={0.75}
          >
            <View style={depositStyles.optionLeftContent}>
              <Text style={depositStyles.gpayGText}>G </Text>
              <Text style={depositStyles.gpayPayText}>Pay</Text>
            </View>
            <Text style={depositStyles.optionRightLabel}>UPI</Text>
          </TouchableOpacity>

          {/* Option 2: Debit/Credit Card */}
          <TouchableOpacity
            style={depositStyles.optionItemRow}
            onPress={() => handleSelectOption('Debit/Credit Card')}
            activeOpacity={0.75}
          >
            <View style={depositStyles.optionLeftContent}>
              <Text style={{ fontSize: 22 }}>💳</Text>
            </View>
            <Text style={depositStyles.optionRightLabelText}>Debit/Credit Card</Text>
          </TouchableOpacity>

          {/* Option 3: Internet Banking */}
          <TouchableOpacity
            style={depositStyles.optionItemRow}
            onPress={() => handleSelectOption('Internet Banking')}
            activeOpacity={0.75}
          >
            <View style={depositStyles.optionLeftContent}>
              <Text style={{ fontSize: 22 }}>🏦</Text>
            </View>
            <Text style={depositStyles.optionRightLabelText}>Internet Banking</Text>
          </TouchableOpacity>
        </View>

        <View style={depositStyles.dividerLineFull} />

        {/* 5. RECENT TRANSACTIONS SECTION */}
        <View style={depositStyles.sectionContainer}>
          <View style={depositStyles.recentHeaderRow}>
            <Text style={depositStyles.sectionTitleText}>Recent Transactions</Text>
            <TouchableOpacity onPress={handleSeeAllTransactions} activeOpacity={0.7}>
              <Text style={depositStyles.seeAllTealLink}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Transaction Card */}
          <TouchableOpacity
            style={depositStyles.transactionCard}
            onPress={handleSeeAllTransactions}
            activeOpacity={0.8}
          >
            <View style={depositStyles.transTextCol}>
              <Text style={depositStyles.transTitleText}>Razor Pay</Text>
              <Text style={depositStyles.transDateText}>10 January, 2019</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                <Text style={depositStyles.transAmountText}>$125</Text>
                <Text style={depositStyles.transStatusGreen}>Successful</Text>
              </View>
              <Text style={depositStyles.transChevronRight}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 6. BOTTOM FLOATING NAVIGATION BAR */}
      <View
        style={[
          depositStyles.bottomNavBarWrapper,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View style={depositStyles.bottomNavBar}>
          {/* Profile Tab */}
          <TouchableOpacity
            style={depositStyles.bottomNavTab}
            onPress={() => onNavigateTab('profile')}
            activeOpacity={0.75}
          >
            <Text style={depositStyles.bottomNavIcon}>👤</Text>
            <Text style={depositStyles.bottomNavLabel}>Profile</Text>
          </TouchableOpacity>

          {/* Orders Tab */}
          <TouchableOpacity
            style={depositStyles.bottomNavTab}
            onPress={() => onNavigateTab('orders')}
            activeOpacity={0.75}
          >
            <Text style={depositStyles.bottomNavIcon}>📦</Text>
            <Text style={depositStyles.bottomNavLabel}>Orders</Text>
          </TouchableOpacity>

          {/* Deposit Tab (Active) */}
          <TouchableOpacity
            style={depositStyles.bottomNavTab}
            onPress={() => onNavigateTab('deposit')}
            activeOpacity={0.75}
          >
            <Text style={[depositStyles.bottomNavIcon, depositStyles.bottomNavIconActive]}>
              💵
            </Text>
            <Text style={[depositStyles.bottomNavLabel, depositStyles.bottomNavLabelActive]}>
              Deposit
            </Text>
          </TouchableOpacity>

          {/* Account Tab */}
          <TouchableOpacity
            style={depositStyles.bottomNavTab}
            onPress={() => onNavigateTab('account')}
            activeOpacity={0.75}
          >
            <Text style={depositStyles.bottomNavIcon}>👤</Text>
            <Text style={depositStyles.bottomNavLabel}>Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const depositStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topHeader: {
    backgroundColor: '#4CA687',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBackBtn: {
    marginRight: 8,
    paddingVertical: 2,
  },
  headerBackArrow: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  utensilCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  bellTouch: {
    position: 'relative',
    padding: 6,
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF3500',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  scrollContent: {
    paddingTop: 16,
  },

  // BALANCE SECTION
  balanceSection: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 6,
  },
  balanceLabelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3F76',
  },
  balanceAmountTeal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4CA687',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  dividerLineFull: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
    marginHorizontal: 20,
  },

  // CASH LIMIT CARD
  limitCardWrapper: {
    paddingHorizontal: 20,
  },
  limitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  limitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  limitTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3F76',
  },
  limitAmountTeal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4CA687',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CA687',
    borderRadius: 4,
  },

  // CHOOSE DEPOSIT OPTION
  sectionContainer: {
    paddingHorizontal: 20,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3F76',
    marginBottom: 14,
  },
  optionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  optionLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpayGText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
  },
  gpayPayText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5F6368',
  },
  optionRightLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3F76',
  },
  optionRightLabelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3F76',
  },

  // RECENT TRANSACTIONS
  recentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  seeAllTealLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CA687',
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  transTextCol: {
    flex: 1,
  },
  transTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D3F76',
    marginBottom: 4,
  },
  transDateText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  transAmountText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2D3F76',
  },
  transStatusGreen: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 2,
  },
  transChevronRight: {
    fontSize: 22,
    color: '#64748B',
    fontWeight: '400',
    marginLeft: 6,
  },

  // BOTTOM FLOATING NAV BAR
  bottomNavBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  bottomNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: width - 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  bottomNavTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bottomNavIcon: {
    fontSize: 22,
    opacity: 0.6,
    marginBottom: 2,
  },
  bottomNavIconActive: {
    opacity: 1,
  },
  bottomNavLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  bottomNavLabelActive: {
    color: '#4CA687',
    fontWeight: '800',
  },
});
