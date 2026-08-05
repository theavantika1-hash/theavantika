import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MyEarningsScreenProps {
  onBack: () => void;
  onNavigateToNotifications?: () => void;
  totalEarningsHeader?: string;
  totalPeriodEarnings?: string;
}

export function MyEarningsScreen({
  onBack,
  onNavigateToNotifications,
  totalEarningsHeader = '$750',
  totalPeriodEarnings = '$210',
}: MyEarningsScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [isOrderPayExpanded, setIsOrderPayExpanded] = useState(true);
  const [activeFilterWheel, setActiveFilterWheel] = useState<'both' | 'order' | 'tips'>('both');

  const handleMonthPress = () => {
    Alert.alert('Select Month', 'Choose month filter:', [
      { text: 'June', onPress: () => setSelectedMonth('June') },
      { text: 'July', onPress: () => setSelectedMonth('July') },
      { text: 'August', onPress: () => setSelectedMonth('August') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={earningsStyles.container}>
      {/* 1. TOP CURVED TEAL HEADER (#4CA687) */}
      <View style={[earningsStyles.topHeader, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={earningsStyles.headerTopRow}>
          <View style={earningsStyles.brandRow}>
            <TouchableOpacity style={earningsStyles.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
              <Text style={earningsStyles.headerBackArrow}>←</Text>
            </TouchableOpacity>
            <View style={earningsStyles.utensilCircle}>
              <Text style={{ fontSize: 16 }}>🍴</Text>
            </View>
            <Text style={earningsStyles.brandTitle}>Food Love</Text>
          </View>

          <TouchableOpacity
            style={earningsStyles.bellTouch}
            onPress={() => {
              if (onNavigateToNotifications) onNavigateToNotifications();
            }}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 20 }}>🔔</Text>
            <View style={earningsStyles.bellBadge}>
              <Text style={earningsStyles.bellBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={earningsStyles.headerTitleRow}>
          <Text style={earningsStyles.headerTitleText}>My Earnings</Text>
          <Text style={earningsStyles.headerTotalAmountText}>{totalEarningsHeader}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          earningsStyles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 30, 40) },
        ]}
      >
        {/* 2. PERIOD TABS ROW (Daily / Weekly / Monthly) */}
        <View style={earningsStyles.periodTabsRow}>
          <TouchableOpacity
            style={earningsStyles.periodTabItem}
            onPress={() => setActiveTab('daily')}
            activeOpacity={0.8}
          >
            <Text style={[earningsStyles.periodTabText, activeTab === 'daily' && earningsStyles.periodTabTextActive]}>
              Daily
            </Text>
            {activeTab === 'daily' && <View style={earningsStyles.activeTabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={earningsStyles.periodTabItem}
            onPress={() => setActiveTab('weekly')}
            activeOpacity={0.8}
          >
            <Text style={[earningsStyles.periodTabText, activeTab === 'weekly' && earningsStyles.periodTabTextActive]}>
              Weekly
            </Text>
            {activeTab === 'weekly' && <View style={earningsStyles.activeTabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={earningsStyles.periodTabItem}
            onPress={() => setActiveTab('monthly')}
            activeOpacity={0.8}
          >
            <Text style={[earningsStyles.periodTabText, activeTab === 'monthly' && earningsStyles.periodTabTextActive]}>
              Monthly
            </Text>
            {activeTab === 'monthly' && <View style={earningsStyles.activeTabUnderline} />}
          </TouchableOpacity>
        </View>

        {/* 3. MONTH DROPDOWN PICKER */}
        <TouchableOpacity style={earningsStyles.monthPickerRow} onPress={handleMonthPress} activeOpacity={0.75}>
          <Text style={earningsStyles.monthPickerText}>{selectedMonth}</Text>
          <Text style={earningsStyles.monthPickerChevron}>∨</Text>
        </TouchableOpacity>

        {/* 4. METRICS STATS CIRCLES (Trips / Orders / Login Hours) */}
        <View style={earningsStyles.statsCirclesRow}>
          <View style={earningsStyles.statCircleCol}>
            <View style={earningsStyles.circleBadge}>
              <Text style={earningsStyles.circleNumText}>32</Text>
            </View>
            <Text style={earningsStyles.circleLabelText}>trips</Text>
          </View>

          <View style={earningsStyles.statCircleCol}>
            <View style={earningsStyles.circleBadge}>
              <Text style={earningsStyles.circleNumText}>48</Text>
            </View>
            <Text style={earningsStyles.circleLabelText}>orders</Text>
          </View>

          <View style={earningsStyles.statCircleCol}>
            <View style={earningsStyles.circleBadge}>
              <Text style={earningsStyles.circleNumText}>42</Text>
            </View>
            <Text style={earningsStyles.circleLabelText}>login hours</Text>
          </View>
        </View>

        {/* 5. EARNINGS BREAKDOWN CARD */}
        <View style={earningsStyles.breakdownCard}>
          <View style={earningsStyles.cardHeaderRow}>
            <Text style={earningsStyles.cardHeaderTitle}>Earnings</Text>
            <Text style={earningsStyles.cardHeaderAmount}>{totalPeriodEarnings}</Text>
          </View>

          {/* Section 1: Order Pay */}
          <View style={earningsStyles.sectionBox}>
            <TouchableOpacity
              style={earningsStyles.sectionHeaderRow}
              onPress={() => setIsOrderPayExpanded(!isOrderPayExpanded)}
              activeOpacity={0.8}
            >
              <View style={earningsStyles.iconCircleTeal}>
                <Text style={{ fontSize: 18 }}>📦</Text>
              </View>

              <View style={earningsStyles.sectionTextCol}>
                <Text style={earningsStyles.sectionTitleText}>Order Pay</Text>
                <Text style={earningsStyles.sectionSubtitleText}>earnings per order</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={earningsStyles.sectionAmountText}>$175</Text>
                <Text style={earningsStyles.sectionChevronText}>
                  {isOrderPayExpanded ? ' ∨' : ' ›'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Sub-breakdown: Distance Pay & Base Pay */}
            {isOrderPayExpanded && (
              <View style={earningsStyles.subBreakdownContainer}>
                <View style={earningsStyles.subRow}>
                  <Text style={earningsStyles.subRowLabel}>Distance Pay</Text>
                  <Text style={earningsStyles.subRowVal}>$120</Text>
                </View>

                <View style={earningsStyles.subRow}>
                  <Text style={earningsStyles.subRowLabel}>Min. Base Pay</Text>
                  <Text style={earningsStyles.subRowVal}>$25</Text>
                </View>
              </View>
            )}
          </View>

          {/* Section 2: Target Pay */}
          <View style={earningsStyles.sectionBox}>
            <View style={earningsStyles.sectionHeaderRow}>
              <View style={earningsStyles.iconCircleTeal}>
                <Text style={{ fontSize: 18 }}>🎯</Text>
              </View>

              <View style={earningsStyles.sectionTextCol}>
                <Text style={earningsStyles.sectionTitleText}>Target Pay</Text>
                <Text style={earningsStyles.sectionSubtitleText}>earnings for reaching order targets</Text>
              </View>

              <Text style={earningsStyles.sectionAmountText}>$0</Text>
            </View>
          </View>

          {/* Section 3: Customer Tips */}
          <View style={earningsStyles.sectionBox}>
            <View style={earningsStyles.sectionHeaderRow}>
              <View style={earningsStyles.iconCircleTeal}>
                <Text style={{ fontSize: 18 }}>💵</Text>
              </View>

              <View style={earningsStyles.sectionTextCol}>
                <Text style={earningsStyles.sectionTitleText}>Customer Tips</Text>
                <Text style={earningsStyles.sectionSubtitleText}>rewards received from customers</Text>
              </View>

              <Text style={earningsStyles.sectionAmountText}>$55</Text>
            </View>
          </View>
        </View>

        {/* 6. BOTTOM DONUT FILTER WHEEL WIDGET */}
        <View style={earningsStyles.wheelWidgetContainer}>
          <View style={earningsStyles.wheelCircleOuter}>
            {/* Top Wedge: Both */}
            <TouchableOpacity
              style={[
                earningsStyles.wedgeBoth,
                activeFilterWheel === 'both' && earningsStyles.wedgeActive,
              ]}
              onPress={() => setActiveFilterWheel('both')}
              activeOpacity={0.8}
            >
              <Text style={earningsStyles.wedgeTextWhite}>Both</Text>
            </TouchableOpacity>

            {/* Bottom Left Wedge: Order Earnings */}
            <TouchableOpacity
              style={earningsStyles.wedgeOrder}
              onPress={() => setActiveFilterWheel('order')}
              activeOpacity={0.8}
            >
              <Text style={earningsStyles.wedgeTextGray}>Order</Text>
              <Text style={earningsStyles.wedgeTextGray}>Earnings</Text>
            </TouchableOpacity>

            {/* Bottom Right Wedge: Tips */}
            <TouchableOpacity
              style={earningsStyles.wedgeTips}
              onPress={() => setActiveFilterWheel('tips')}
              activeOpacity={0.8}
            >
              <Text style={earningsStyles.wedgeTextGray}>Tips</Text>
            </TouchableOpacity>

            {/* Center Teal Circular Filter Button */}
            <View style={earningsStyles.centerFilterBtn}>
              <Text style={{ fontSize: 16 }}>🔻</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const earningsStyles = StyleSheet.create({
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
    justifyContent: 'space-between',
  },
  headerTitleText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerTotalAmountText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  scrollContent: {
    paddingTop: 12,
  },

  // PERIOD TABS ROW
  periodTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  periodTabItem: {
    position: 'relative',
    paddingVertical: 14,
    alignItems: 'center',
    flex: 1,
  },
  periodTabText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#64748B',
  },
  periodTabTextActive: {
    color: '#2D3F76',
    fontWeight: '800',
  },
  activeTabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '15%',
    right: '15%',
    height: 3,
    backgroundColor: '#4CA687',
    borderRadius: 1.5,
  },

  // MONTH DROPDOWN
  monthPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  monthPickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3F76',
  },
  monthPickerChevron: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },

  // STATS CIRCLES
  statsCirclesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCircleCol: {
    alignItems: 'center',
  },
  circleBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  circleNumText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3F76',
  },
  circleLabelText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  // BREAKDOWN CARD
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 28,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3F76',
  },
  cardHeaderAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4CA687',
  },

  // SECTION BOX
  sectionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleTeal: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CA687',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTextCol: {
    flex: 1,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3F76',
    marginBottom: 2,
  },
  sectionSubtitleText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '400',
  },
  sectionAmountText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4CA687',
  },
  sectionChevronText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
    marginLeft: 4,
  },

  // SUB-BREAKDOWN
  subBreakdownContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subRowLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  subRowVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3F76',
  },

  // WHEEL WIDGET
  wheelWidgetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  wheelCircleOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  wedgeBoth: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: '#4CA687',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 14,
  },
  wedgeActive: {
    backgroundColor: '#3B8B6E',
  },
  wedgeOrder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 110,
    height: 110,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  wedgeTips: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 110,
    height: 110,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  wedgeTextWhite: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  wedgeTextGray: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  centerFilterBtn: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CA687',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
});
