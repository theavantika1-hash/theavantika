import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface DriverRatingItem {
  rank: number;
  name: string;
  avatar: string;
  rating: string;
  ordersCount: string;
  isTopThree?: boolean;
}

export const MOCK_LEADERBOARD: DriverRatingItem[] = [
  {
    rank: 1,
    name: 'Robert',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: '4.5',
    ordersCount: '108 orders',
    isTopThree: true,
  },
  {
    rank: 2,
    name: 'Nathan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: '4.5',
    ordersCount: '98 orders',
    isTopThree: true,
  },
  {
    rank: 3,
    name: 'Goeey',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    rating: '4.5',
    ordersCount: '92 orders',
    isTopThree: true,
  },
  {
    rank: 4,
    name: 'Darrell',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: '4.5',
    ordersCount: '55 orders',
    isTopThree: false,
  },
  {
    rank: 5,
    name: 'Bernard',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    rating: '4.5',
    ordersCount: '45 orders',
    isTopThree: false,
  },
  {
    rank: 6,
    name: 'Jacob',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    rating: '4.5',
    ordersCount: '35 orders',
    isTopThree: false,
  },
  {
    rank: 7,
    name: 'Lee',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    rating: '4.5',
    ordersCount: '33 orders',
    isTopThree: false,
  },
];

interface RatingsScreenProps {
  onBack: () => void;
  onNavigateToNotifications?: () => void;
}

export function RatingsScreen({ onBack, onNavigateToNotifications }: RatingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateFilter, setDateFilter] = useState('01-98-21');
  const [localityFilter, setLocalityFilter] = useState('Localities');

  const handleDatePress = () => {
    Alert.alert('Date Filter', 'Select date range:', [
      { text: '01-98-21', onPress: () => setDateFilter('01-98-21') },
      { text: '02-98-21', onPress: () => setDateFilter('02-98-21') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLocalityPress = () => {
    Alert.alert('Locality Filter', 'Select desired locality:', [
      { text: 'All Localities', onPress: () => setLocalityFilter('All') },
      { text: 'Phase-II UE', onPress: () => setLocalityFilter('Phase-II') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={ratingStyles.container}>
      {/* 1. TOP CURVED TEAL HEADER (#4CA687) */}
      <View style={[ratingStyles.topHeader, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={ratingStyles.headerTopRow}>
          <View style={ratingStyles.brandRow}>
            <TouchableOpacity style={ratingStyles.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
              <Text style={ratingStyles.headerBackArrow}>←</Text>
            </TouchableOpacity>
            <View style={ratingStyles.utensilCircle}>
              <Text style={{ fontSize: 16 }}>🍴</Text>
            </View>
            <Text style={ratingStyles.brandTitle}>Food Love</Text>
          </View>

          <TouchableOpacity
            style={ratingStyles.bellTouch}
            onPress={() => {
              if (onNavigateToNotifications) onNavigateToNotifications();
            }}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 20 }}>🔔</Text>
            <View style={ratingStyles.bellBadge}>
              <Text style={ratingStyles.bellBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={ratingStyles.headerTitleRow}>
          <Text style={ratingStyles.headerTitleText}>Ratings</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          ratingStyles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 24, 32) },
        ]}
      >
        {/* 2. PERIOD TABS ROW (Daily / Weekly / Monthly) */}
        <View style={ratingStyles.periodTabsRow}>
          <TouchableOpacity
            style={ratingStyles.periodTabItem}
            onPress={() => setActiveTab('daily')}
            activeOpacity={0.8}
          >
            <Text style={[ratingStyles.periodTabText, activeTab === 'daily' && ratingStyles.periodTabTextActive]}>
              Daily
            </Text>
            {activeTab === 'daily' && <View style={ratingStyles.activeTabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={ratingStyles.periodTabItem}
            onPress={() => setActiveTab('weekly')}
            activeOpacity={0.8}
          >
            <Text style={[ratingStyles.periodTabText, activeTab === 'weekly' && ratingStyles.periodTabTextActive]}>
              Weekly
            </Text>
            {activeTab === 'weekly' && <View style={ratingStyles.activeTabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={ratingStyles.periodTabItem}
            onPress={() => setActiveTab('monthly')}
            activeOpacity={0.8}
          >
            <Text style={[ratingStyles.periodTabText, activeTab === 'monthly' && ratingStyles.periodTabTextActive]}>
              Monthly
            </Text>
            {activeTab === 'monthly' && <View style={ratingStyles.activeTabUnderline} />}
          </TouchableOpacity>
        </View>

        {/* 3. FILTER DROPDOWNS ROW */}
        <View style={ratingStyles.filtersRow}>
          {/* Date Dropdown */}
          <TouchableOpacity
            style={ratingStyles.filterPickerBtn}
            onPress={handleDatePress}
            activeOpacity={0.75}
          >
            <Text style={ratingStyles.filterPickerText}>{dateFilter}</Text>
            <Text style={ratingStyles.filterPickerChevron}>∨</Text>
          </TouchableOpacity>

          {/* Localities Dropdown */}
          <TouchableOpacity
            style={ratingStyles.filterPickerBtn}
            onPress={handleLocalityPress}
            activeOpacity={0.75}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={ratingStyles.filterPickerText}>{localityFilter}</Text>
              <View style={ratingStyles.badgeCircle}>
                <Text style={ratingStyles.badgeText}>2</Text>
              </View>
            </View>
            <Text style={ratingStyles.filterPickerChevron}>∨</Text>
          </TouchableOpacity>
        </View>

        {/* 4. USER PERFORMANCE SUMMARY CARD */}
        <View style={ratingStyles.userSummaryCard}>
          {/* Left Column: Avatar & Name */}
          <View style={ratingStyles.userLeftCol}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
              }}
              style={ratingStyles.userAvatarImage}
            />
            <View style={{ justifyContent: 'center' }}>
              <Text style={ratingStyles.userNameTitle}>John Doe</Text>
              <View style={ratingStyles.userRatingRow}>
                <Text style={ratingStyles.starIcon}>★</Text>
                <Text style={ratingStyles.ratingValueText}>4.5</Text>
              </View>
            </View>
          </View>

          <View style={ratingStyles.cardVerticalDivider} />

          {/* Right Column: Rank, Ratings, Orders Count */}
          <View style={ratingStyles.userRightCol}>
            <View style={ratingStyles.pillsRow}>
              {/* Rank Badge Pill */}
              <View style={ratingStyles.rankBadgePill}>
                <Text style={ratingStyles.rankBadgeNumText}>108</Text>
                <Text style={ratingStyles.rankBadgeLabel}>rank</Text>
              </View>

              {/* Ratings Badge Pill */}
              <View style={ratingStyles.ratingsBadgePill}>
                <Text style={ratingStyles.ratingsBadgeNumText}>32</Text>
                <Text style={ratingStyles.ratingsBadgeLabel}>ratings</Text>
              </View>
            </View>

            <Text style={ratingStyles.ordersCountText}>48+ Orders</Text>
          </View>
        </View>

        {/* 5. DRIVER LEADERBOARD LIST */}
        <View style={ratingStyles.leaderboardList}>
          {MOCK_LEADERBOARD.map((item) => (
            <View
              key={item.rank}
              style={[
                ratingStyles.driverCard,
                item.isTopThree ? ratingStyles.driverCardTopThree : ratingStyles.driverCardNormal,
              ]}
            >
              {/* Left Rank Icon / Number */}
              <View style={ratingStyles.rankBadgeContainer}>
                {item.isTopThree ? (
                  <View style={ratingStyles.ribbonCircle}>
                    <Text style={ratingStyles.ribbonRankNum}>{item.rank}</Text>
                  </View>
                ) : (
                  <Text style={ratingStyles.normalRankNum}>{item.rank}</Text>
                )}
              </View>

              {/* Avatar Image */}
              <Image source={{ uri: item.avatar }} style={ratingStyles.driverAvatar} />

              {/* Name & Rating */}
              <View style={ratingStyles.driverInfoCol}>
                <Text style={ratingStyles.driverNameText}>{item.name}</Text>
                <View style={ratingStyles.driverRatingRow}>
                  <Text style={ratingStyles.starIconSmall}>★</Text>
                  <Text style={ratingStyles.ratingValueTextSmall}>{item.rating}</Text>
                </View>
              </View>

              {/* Orders Count Right Text */}
              <Text style={ratingStyles.driverOrdersText}>{item.ordersCount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const ratingStyles = StyleSheet.create({
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

  // FILTERS ROW
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 16,
  },
  filterPickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3F76',
  },
  filterPickerChevron: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  badgeCircle: {
    backgroundColor: '#4CA687',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // USER PERFORMANCE SUMMARY CARD
  userSummaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
  },
  userLeftCol: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  userNameTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3F76',
    marginBottom: 4,
  },
  userRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: '#FFB800',
    fontSize: 14,
    marginRight: 4,
  },
  ratingValueText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2D3F76',
  },
  cardVerticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 12,
  },
  userRightCol: {
    flex: 1,
    alignItems: 'center',
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankBadgePill: {
    backgroundColor: '#E6F4F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  rankBadgeNumText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4CA687',
  },
  rankBadgeLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  ratingsBadgePill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  ratingsBadgeNumText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D3F76',
  },
  ratingsBadgeLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  ordersCountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D3F76',
    marginTop: 6,
  },

  // DRIVER LEADERBOARD LIST
  leaderboardList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  driverCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverCardTopThree: {
    backgroundColor: '#E6F4F0',
  },
  driverCardNormal: {
    backgroundColor: '#F1F5F9',
  },
  rankBadgeContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonRankNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2D3F76',
  },
  normalRankNum: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3F76',
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 12,
  },
  driverInfoCol: {
    flex: 1,
  },
  driverNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3F76',
    marginBottom: 2,
  },
  driverRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIconSmall: {
    color: '#FFB800',
    fontSize: 12,
    marginRight: 4,
  },
  ratingValueTextSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D3F76',
  },
  driverOrdersText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
});
