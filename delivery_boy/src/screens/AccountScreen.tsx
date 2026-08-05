import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface AccountScreenProps {
  onNavigateTab: (tab: 'profile' | 'orders' | 'deposit' | 'account') => void;
  selectedLanguage?: { name: string; flag: string };
  onNavigateToEarnings?: () => void;
  onNavigateToRatings?: () => void;
  onNavigateToPayoutTerms?: () => void;
  onNavigateToLanguage?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToLocalities?: () => void;
  onLogout?: () => void;
}

export function AccountScreen({
  onNavigateTab,
  selectedLanguage = { name: 'English', flag: '🇺🇸' },
  onNavigateToEarnings,
  onNavigateToRatings,
  onNavigateToPayoutTerms,
  onNavigateToLanguage,
  onNavigateToNotifications,
  onNavigateToLocalities,
  onLogout,
}: AccountScreenProps) {
  const insets = useSafeAreaInsets();
  const [isAvailable, setIsAvailable] = useState(true);

  const handleOptionPress = (title: string, callback?: () => void) => {
    if (callback) {
      callback();
    } else {
      Alert.alert(title, `Opening ${title} settings...`);
    }
  };

  return (
    <View style={accountStyles.container}>
      <ScrollView
        contentContainerStyle={accountStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* 1. TOP CURVED TEAL HEADER (#4CA687) */}
        <View style={[accountStyles.topHeader, { paddingTop: Math.max(insets.top + 8, 20) }]}>
          {/* Header Top Row: Brand Logo & Bell Notification */}
          <View style={accountStyles.headerTopRow}>
            <View style={accountStyles.brandRow}>
              <View style={accountStyles.utensilCircle}>
                <Text style={{ fontSize: 16 }}>🍴</Text>
              </View>
              <Text style={accountStyles.brandTitle}>Food Love</Text>
            </View>

            <TouchableOpacity
              style={accountStyles.bellTouch}
              onPress={() => {
                if (onNavigateToNotifications) onNavigateToNotifications();
              }}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 20 }}>🔔</Text>
              <View style={accountStyles.bellBadge}>
                <Text style={accountStyles.bellBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* User Profile Info Row */}
          <View style={accountStyles.profileRow}>
            {/* Avatar Image */}
            <View style={accountStyles.avatarBox}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                }}
                style={accountStyles.avatarImage}
              />
            </View>

            {/* Name, Contact, Rating, Availability */}
            <View style={accountStyles.profileInfoCol}>
              <View style={accountStyles.nameRatingRow}>
                <Text style={accountStyles.userNameText}>John Doe</Text>
                <View style={accountStyles.ratingBadge}>
                  <Text style={accountStyles.starIcon}>★</Text>
                  <Text style={accountStyles.ratingText}>4.5</Text>
                </View>
              </View>

              <Text style={accountStyles.userContactText}>✉ john@gmail.com</Text>
              <Text style={accountStyles.userContactText}>📞 +41-12311-10245</Text>

              {/* Availability Switch */}
              <View style={accountStyles.availabilityRow}>
                <Switch
                  trackColor={{ false: 'rgba(255, 255, 255, 0.4)', true: '#2D8A68' }}
                  thumbColor="#FFFFFF"
                  onValueChange={setIsAvailable}
                  value={isAvailable}
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], marginLeft: -6 }}
                />
                <Text style={accountStyles.availableLabelText}>Available</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2. MY EARNINGS OVERLAPPING CARD */}
        <View style={accountStyles.earningsCardWrapper}>
          <TouchableOpacity
            style={accountStyles.earningsCard}
            onPress={() => {
              if (onNavigateToEarnings) onNavigateToEarnings();
            }}
            activeOpacity={0.9}
          >
            <View style={accountStyles.earningsHeaderRow}>
              <View>
                <Text style={accountStyles.earningsTitle}>My Earnings</Text>
                <View style={accountStyles.titleUnderline} />
              </View>

              <TouchableOpacity
                style={accountStyles.earningsArrowCircle}
                onPress={() => {
                  if (onNavigateToEarnings) onNavigateToEarnings();
                }}
                activeOpacity={0.8}
              >
                <Text style={accountStyles.earningsArrowText}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* Metrics 3 Columns */}
            <View style={accountStyles.metricsRow}>
              <View style={accountStyles.metricCol}>
                <Text style={accountStyles.metricLabel}>Total Earnings</Text>
                <Text style={accountStyles.metricValueText}>USD 750</Text>
              </View>

              <View style={accountStyles.metricCol}>
                <Text style={accountStyles.metricLabel}>Tips Earned</Text>
                <Text style={accountStyles.metricValueText}>USD 50</Text>
              </View>

              <View style={accountStyles.metricCol}>
                <Text style={accountStyles.metricLabel}>Orders Served</Text>
                <Text style={accountStyles.metricValueText}>25</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 3. MENU OPTIONS LIST CARDS */}
        <View style={accountStyles.menuListContainer}>
          {/* Option 1: Ratings */}
          <TouchableOpacity
            style={accountStyles.optionCard}
            onPress={() => handleOptionPress('Ratings', onNavigateToRatings)}
            activeOpacity={0.75}
          >
            <View style={accountStyles.optionTextCol}>
              <Text style={accountStyles.optionTitleText}>Ratings</Text>
              <Text style={accountStyles.optionSubtitleText}>
                Check customer remarks and ratings received
              </Text>
            </View>
            <Text style={accountStyles.chevronRight}>›</Text>
          </TouchableOpacity>

          {/* Option 2: Payout Terms */}
          <TouchableOpacity
            style={accountStyles.optionCard}
            onPress={() => handleOptionPress('Payout Terms', onNavigateToPayoutTerms)}
            activeOpacity={0.75}
          >
            <View style={accountStyles.optionTextCol}>
              <Text style={accountStyles.optionTitleText}>Payout Terms</Text>
              <Text style={accountStyles.optionSubtitleText}>
                Check how you could earn and payment credits in your account.
              </Text>
            </View>
            <Text style={accountStyles.chevronRight}>›</Text>
          </TouchableOpacity>

          {/* Option 3: Language */}
          <TouchableOpacity
            style={accountStyles.optionCard}
            onPress={() => handleOptionPress('Language', onNavigateToLanguage)}
            activeOpacity={0.75}
          >
            <View style={accountStyles.optionTextCol}>
              <Text style={accountStyles.optionTitleText}>Language</Text>
              <View style={accountStyles.languageFlagRow}>
                <Text style={{ fontSize: 16, marginRight: 6 }}>{selectedLanguage.flag}</Text>
                <Text style={accountStyles.languageRedText}>{selectedLanguage.name}</Text>
              </View>
            </View>
            <Text style={accountStyles.chevronRight}>›</Text>
          </TouchableOpacity>

          {/* Option 4: Notifications Area */}
          <TouchableOpacity
            style={accountStyles.optionCard}
            onPress={() => handleOptionPress('Notifications Area', onNavigateToNotifications)}
            activeOpacity={0.75}
          >
            <View style={accountStyles.optionTextCol}>
              <Text style={accountStyles.optionTitleText}>Notifications Area</Text>
              <Text style={accountStyles.optionSubtitleText}>
                Appreciations & other notifications if applicable
              </Text>
            </View>
            <Text style={accountStyles.chevronRight}>›</Text>
          </TouchableOpacity>

          {/* Option 5: Localities */}
          <TouchableOpacity
            style={accountStyles.optionCard}
            onPress={() => handleOptionPress('Localities', onNavigateToLocalities)}
            activeOpacity={0.75}
          >
            <View style={accountStyles.optionTextCol}>
              <Text style={accountStyles.optionTitleText}>Localities</Text>
              <Text style={accountStyles.optionSubtitleText}>
                Select your desired localities in your area.
              </Text>
            </View>
            <Text style={accountStyles.chevronRight}>›</Text>
          </TouchableOpacity>

          {/* Option 6: Logout */}
          <TouchableOpacity
            style={accountStyles.optionCard}
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to log out?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Log Out',
                  style: 'destructive',
                  onPress: () => {
                    if (onLogout) onLogout();
                  },
                },
              ]);
            }}
            activeOpacity={0.75}
          >
            <View style={accountStyles.optionTextCol}>
              <Text style={[accountStyles.optionTitleText, { color: '#FF3500' }]}>Log Out</Text>
              <Text style={accountStyles.optionSubtitleText}>
                Sign out of your delivery boy account
              </Text>
            </View>
            <Text style={[accountStyles.chevronRight, { color: '#FF3500' }]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 4. BOTTOM FLOATING NAVIGATION BAR */}
      <View
        style={[
          accountStyles.bottomNavBarWrapper,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View style={accountStyles.bottomNavBar}>
          {/* Profile Tab */}
          <TouchableOpacity
            style={accountStyles.bottomNavTab}
            onPress={() => onNavigateTab('profile')}
            activeOpacity={0.75}
          >
            <Text style={accountStyles.bottomNavIcon}>👤</Text>
            <Text style={accountStyles.bottomNavLabel}>Profile</Text>
          </TouchableOpacity>

          {/* Orders Tab */}
          <TouchableOpacity
            style={accountStyles.bottomNavTab}
            onPress={() => onNavigateTab('orders')}
            activeOpacity={0.75}
          >
            <Text style={accountStyles.bottomNavIcon}>📦</Text>
            <Text style={accountStyles.bottomNavLabel}>Orders</Text>
          </TouchableOpacity>

          {/* Deposit Tab */}
          <TouchableOpacity
            style={accountStyles.bottomNavTab}
            onPress={() => onNavigateTab('deposit')}
            activeOpacity={0.75}
          >
            <Text style={accountStyles.bottomNavIcon}>💵</Text>
            <Text style={accountStyles.bottomNavLabel}>Deposit</Text>
          </TouchableOpacity>

          {/* Account Tab (Active) */}
          <TouchableOpacity
            style={accountStyles.bottomNavTab}
            onPress={() => onNavigateTab('account')}
            activeOpacity={0.75}
          >
            <Text style={[accountStyles.bottomNavIcon, accountStyles.bottomNavIconActive]}>
              👤
            </Text>
            <Text style={[accountStyles.bottomNavLabel, accountStyles.bottomNavLabelActive]}>
              Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const accountStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 110,
    backgroundColor: '#FAFAFA',
  },

  // TOP HEADER (#4CA687 TEAL)
  topHeader: {
    backgroundColor: '#4CA687',
    paddingHorizontal: 22,
    paddingBottom: 65,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  utensilCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
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
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // PROFILE ROW
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    marginRight: 16,
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfoCol: {
    flex: 1,
  },
  nameRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: '#FFB800',
    fontSize: 15,
    marginRight: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  userContactText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 2,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  availableLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // MY EARNINGS OVERLAPPING CARD
  earningsCardWrapper: {
    marginTop: -45,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  earningsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  earningsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3F76',
  },
  titleUnderline: {
    height: 3,
    width: 34,
    backgroundColor: '#FF3500',
    borderRadius: 1.5,
    marginTop: 4,
  },
  earningsArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2D3F76',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningsArrowText: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  metricCol: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3F76',
  },

  // MENU OPTIONS LIST CARDS
  menuListContainer: {
    paddingHorizontal: 20,
    gap: 14,
  },
  optionCard: {
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
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  optionTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  optionTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D3F76',
    marginBottom: 4,
  },
  optionSubtitleText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '400',
    lineHeight: 17,
  },
  languageFlagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  languageRedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF3500',
  },
  chevronRight: {
    fontSize: 22,
    color: '#64748B',
    fontWeight: '400',
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
