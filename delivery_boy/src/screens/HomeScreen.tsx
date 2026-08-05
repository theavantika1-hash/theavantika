import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/appStyles';
import { deliveryBoyApi } from '../config/api';

const { width } = Dimensions.get('window');

export function HomeScreen({
  userEmail,
  onNavigateToLogin,
  onNavigateToLocation,
  onNavigateToOrders,
  onNavigateToAccount,
  onNavigateToNotifications,
  onNavigateToDeposit,
  currentLocationText = '#321, Phase-II, UE, Ludhiana, India...',
}: {
  userEmail?: string;
  onNavigateToLogin: () => void;
  onNavigateToLocation: () => void;
  onNavigateToOrders: () => void;
  onNavigateToAccount?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToDeposit?: () => void;
  currentLocationText?: string;
}) {
  const insets = useSafeAreaInsets();

  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'range' | 'bank'>('stats');
  const [selectedKm, setSelectedKm] = useState(32);
  const [chartFilter, setChartFilter] = useState<'quarterly' | 'monthly' | 'weekly'>('quarterly');
  const [activeBottomTab, setActiveBottomTab] = useState<'profile' | 'orders' | 'deposit' | 'account'>('profile');

  // Real Database State
  const [partnerName, setPartnerName] = useState('Partner');
  const [avatarUri, setAvatarUri] = useState<string>('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80');
  const [totalOrders, setTotalOrders] = useState(100);
  const [totalEarnings, setTotalEarnings] = useState(10000);
  const [growthPercentage, setGrowthPercentage] = useState('+ 7% ↑');
  const [bankAccountInfo, setBankAccountInfo] = useState('HDFC Bank •••• 4821 (Verified)');
  const [quarterlyData, setQuarterlyData] = useState([{ month: 'January', val: 52 }, { month: 'February', val: 76 }, { month: 'March', val: 76 }, { month: 'April', val: 100 }]);
  const [monthlyData, setMonthlyData] = useState([{ month: 'Week 1', val: 40 }, { month: 'Week 2', val: 65 }, { month: 'Week 3', val: 80 }, { month: 'Week 4', val: 95 }]);
  const [weeklyData, setWeeklyData] = useState([{ month: 'Mon', val: 30 }, { month: 'Wed', val: 60 }, { month: 'Fri', val: 85 }, { month: 'Sun', val: 70 }]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Live Real Data from Backend Database
  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const res = await deliveryBoyApi.getDashboardStats(userEmail);
        if (res.data) {
          const { profile, stats } = res.data;
          if (profile) {
            if (profile.name) setPartnerName(profile.name);
            if (profile.profileImage) setAvatarUri(profile.profileImage);
            if (typeof profile.isOnline === 'boolean') setIsAvailable(profile.isOnline);
            if (profile.preferredRangeKm) setSelectedKm(profile.preferredRangeKm);
            if (profile.bankAccount) setBankAccountInfo(profile.bankAccount);
          }
          if (stats) {
            if (stats.totalOrders) setTotalOrders(stats.totalOrders);
            if (stats.totalEarnings) setTotalEarnings(stats.totalEarnings);
            if (stats.growthPercentage) setGrowthPercentage(stats.growthPercentage);
            if (stats.quarterlyChart) setQuarterlyData(stats.quarterlyChart);
            if (stats.monthlyChart) setMonthlyData(stats.monthlyChart);
            if (stats.weeklyChart) setWeeklyData(stats.weeklyChart);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats from database:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [userEmail]);

  // Handle Availability Toggle Switch with Database Update
  const handleToggleAvailable = async (val: boolean) => {
    setIsAvailable(val);
    try {
      await deliveryBoyApi.toggleStatus({ isOnline: val });
    } catch (e) {
      console.error('Failed to update status in database:', e);
    }
  };

  // Gauge Dots Configuration around circle
  const gaugeDots = [
    { angle: -140, km: 5 },
    { angle: -115, km: 10 },
    { angle: -90, km: 15 },
    { angle: -65, km: 20 },
    { angle: -40, km: 25 },
    { angle: -15, km: 30 },
    { angle: 10, km: 32 },
    { angle: 35, km: 35 },
    { angle: 60, km: 40 },
    { angle: 85, km: 45 },
    { angle: 110, km: 50 },
    { angle: 135, km: 60 },
  ];

  // Chart data based on selected filter
  const chartData =
    chartFilter === 'quarterly'
      ? quarterlyData
      : chartFilter === 'monthly'
      ? monthlyData
      : weeklyData;


  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.homeScrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* TOP YELLOW CURVED HEADER */}
        <View style={[styles.homeTopHeader, { paddingTop: Math.max(insets.top + 8, 20) }]}>
          <View style={styles.homeHeaderTopRow}>
            {/* App Brand */}
            <View style={styles.homeBrandRow}>
              <View style={styles.homeUtensilCircle}>
                <Text style={{ fontSize: 16 }}>🍴</Text>
              </View>
              <Text style={styles.homeBrandTitle}>Food Love</Text>
            </View>

            {/* Availability Toggle */}
            <View style={styles.homeAvailabilityRow}>
              <Switch
                trackColor={{ false: '#CBD5E1', true: '#4CA687' }}
                thumbColor="#FFFFFF"
                onValueChange={handleToggleAvailable}
                value={isAvailable}
                style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
              />
              <Text style={styles.homeAvailableText}>Available</Text>
            </View>

            {/* Notification Bell */}
            <TouchableOpacity
              style={styles.homeBellTouch}
              onPress={() => {
                if (onNavigateToNotifications) onNavigateToNotifications();
              }}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 20 }}>🔔</Text>
              <View style={styles.homeBellBadge}>
                <Text style={styles.homeBellBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* PROFILE OVERLAPPING CARD */}
        <View style={styles.homeProfileCardWrapper}>
          <View style={styles.homeProfileCard}>
            <View style={styles.homeAvatarBox}>
              <Image
                source={{ uri: avatarUri }}
                style={styles.homeAvatarImage}
              />
              <View style={styles.homeVerifiedBadge}>
                <Text style={styles.homeVerifiedCheckText}>✓</Text>
              </View>
            </View>

            <View style={styles.homeProfileInfo}>
              <Text style={styles.homeWelcomeTitle}>Welcome {partnerName}!</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.homeEditProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* TABS ROW: Profile Stats / Range / Linked Bank Account */}
        <View style={styles.homeTabsRow}>
          <TouchableOpacity
            style={styles.homeTabItem}
            onPress={() => setActiveTab('stats')}
            activeOpacity={0.8}
          >
            <Text style={[styles.homeTabText, activeTab === 'stats' && styles.homeTabTextActive]}>
              Profile Stats
            </Text>
            {activeTab === 'stats' && <View style={styles.homeTabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeTabItem}
            onPress={() => setActiveTab('range')}
            activeOpacity={0.8}
          >
            <Text style={[styles.homeTabText, activeTab === 'range' && styles.homeTabTextActive]}>
              Range
            </Text>
            {activeTab === 'range' && <View style={styles.homeTabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeTabItem}
            onPress={() => setActiveTab('bank')}
            activeOpacity={0.8}
          >
            <Text style={[styles.homeTabText, activeTab === 'bank' && styles.homeTabTextActive]}>
              Linked Bank Account
            </Text>
            {activeTab === 'bank' && <View style={styles.homeTabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* CONTENT FOR PROFILE STATS TAB */}
        {activeTab === 'stats' && (
          <View style={styles.homeTabContentContainer}>
            {/* ORDERS FULFILLED STAT CARD */}
            <View style={styles.homeStatCard}>
              <View style={styles.homeStatTopRow}>
                <View>
                  <Text style={styles.homeStatTitle}>Orders Fulfilled</Text>
                  <Text style={styles.homeStatSubtitle}>Last 4 months</Text>
                </View>
                <View style={styles.homeStatGrowthBadge}>
                  <Text style={styles.homeStatGrowthText}>{growthPercentage}</Text>
                </View>
              </View>

              <View style={styles.homeStatBottomRow}>
                <View>
                  <Text style={styles.homeStatMetaLabel}>Total Orders</Text>
                  <Text style={styles.homeStatMetaVal}>{totalOrders}</Text>
                </View>

                <Text style={styles.homeStatAmountVal}>${totalEarnings}</Text>
              </View>
            </View>


            {/* INTERACTIVE BAR CHART CONTAINER */}
            <View style={styles.homeChartContainer}>
              {/* Chart Filter Pills Row */}
              <View style={styles.homeChartFiltersRow}>
                <TouchableOpacity
                  style={[
                    styles.homeChartFilterBtn,
                    chartFilter === 'quarterly' && styles.homeChartFilterBtnActive,
                  ]}
                  onPress={() => setChartFilter('quarterly')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.homeChartFilterText,
                      chartFilter === 'quarterly' && styles.homeChartFilterTextActive,
                    ]}
                  >
                    Quarterly
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.homeChartFilterBtn,
                    chartFilter === 'monthly' && styles.homeChartFilterBtnActive,
                  ]}
                  onPress={() => setChartFilter('monthly')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.homeChartFilterText,
                      chartFilter === 'monthly' && styles.homeChartFilterTextActive,
                    ]}
                  >
                    Monthly
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.homeChartFilterBtn,
                    chartFilter === 'weekly' && styles.homeChartFilterBtnActive,
                  ]}
                  onPress={() => setChartFilter('weekly')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.homeChartFilterText,
                      chartFilter === 'weekly' && styles.homeChartFilterTextActive,
                    ]}
                  >
                    Weekly
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Bar Chart Grid */}
              <View style={styles.homeChartGridWrapper}>
                {/* Y-Axis Labels */}
                <View style={styles.homeChartYAxis}>
                  <Text style={styles.homeChartAxisText}>100</Text>
                  <Text style={styles.homeChartAxisText}>75</Text>
                  <Text style={styles.homeChartAxisText}>50</Text>
                  <Text style={styles.homeChartAxisText}>25</Text>
                  <Text style={styles.homeChartAxisText}>0</Text>
                </View>

                {/* Bars Plot Area */}
                <View style={styles.homeChartPlotArea}>
                  {/* Axis lines */}
                  <View style={styles.homeChartYAxisLine} />
                  <View style={styles.homeChartXAxisLine} />

                  {/* Bars Row */}
                  <View style={styles.homeChartBarsRow}>
                    {chartData.map((item, index) => {
                      return (
                        <View key={index} style={styles.homeBarCol}>
                          <View style={[styles.homeBarTrack, { height: 160 }]}>
                            <View
                              style={[
                                styles.homeBarFill,
                                { height: `${item.val}%` as const },
                              ]}
                            />
                          </View>
                          <Text style={styles.homeBarLabel} numberOfLines={1}>
                            {item.month}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Carousel Indicator Dots */}
              <View style={styles.homeChartDotsRow}>
                <View style={[styles.homeChartDot, styles.homeChartDotActive]} />
                <View style={styles.homeChartDot} />
                <View style={styles.homeChartDot} />
              </View>
            </View>
          </View>
        )}

        {/* RANGE TAB CONTENT */}
        {activeTab === 'range' && (
          <View style={styles.homeTabContentContainer}>
            {/* LOCATION & RANGE INFO CARD */}
            <View style={styles.rangeInfoCard}>
              {/* Location Row */}
              <TouchableOpacity
                style={styles.rangeRowTouch}
                onPress={onNavigateToLocation}
                activeOpacity={0.7}
              >
                <View style={styles.rangeIconCircle}>
                  <Text style={styles.rangePinEmoji}>📍</Text>
                </View>
                <View style={styles.rangeRowInfo}>
                  <Text style={styles.rangeRowTitleRed}>Location</Text>
                  <Text style={styles.rangeRowSubtitle} numberOfLines={1}>
                    {currentLocationText}
                  </Text>
                </View>
                <Text style={styles.rangeArrowRight}>→</Text>
              </TouchableOpacity>

              <View style={styles.rangeDividerLine} />

              {/* Range Row */}
              <View style={styles.rangeRowTouch}>
                <View style={styles.rangeIconCircle}>
                  <Text style={styles.rangePinEmoji}>🚩</Text>
                </View>
                <View style={styles.rangeRowInfo}>
                  <Text style={styles.rangeRowTitleRed}>Range</Text>
                  <Text style={styles.rangeDistanceVal}>{selectedKm} km</Text>
                </View>
              </View>
            </View>

            {/* CIRCULAR GAUGE DIAL WIDGET */}
            <View style={styles.rangeGaugeContainer}>
              <View style={styles.rangeGaugeOuterRing}>
                <View style={styles.rangeGaugeMiddleRing}>
                  {/* Circular Arc Dots */}
                  {gaugeDots.map((dot, idx) => {
                    const angleRad = (dot.angle * Math.PI) / 180;
                    const radius = 78;
                    const x = radius * Math.cos(angleRad);
                    const y = radius * Math.sin(angleRad);
                    const isSelected = dot.km <= selectedKm;
                    const isKnob = dot.km === selectedKm;

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.gaugeDotItem,
                          { transform: [{ translateX: x }, { translateY: y }] },
                          isSelected && styles.gaugeDotSelected,
                          isKnob && styles.gaugeKnobDot,
                        ]}
                        onPress={() => setSelectedKm(dot.km)}
                        activeOpacity={0.8}
                      >
                        {isKnob && <View style={styles.gaugeKnobInnerBlack} />}
                      </TouchableOpacity>
                    );
                  })}

                  {/* Inner Center Circle with Current Selected Distance */}
                  <View style={styles.rangeGaugeInnerCircle}>
                    <Text style={styles.rangeGaugeUnitText}>km</Text>
                    <Text style={styles.rangeGaugeValueText}>{selectedKm}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* LINKED BANK ACCOUNT TAB CONTENT */}
        {activeTab === 'bank' && (
          <View style={styles.homeTabContentContainer}>
            <View style={styles.homeStatCard}>
              <Text style={styles.homeStatTitle}>Bank Account Details</Text>
              <Text style={[styles.homeStatSubtitle, { marginTop: 6 }]}>
                {bankAccountInfo}
              </Text>
            </View>
          </View>
        )}

      </ScrollView>

      {/* BOTTOM FLOATING NAVIGATION BAR */}
      <View style={[styles.homeBottomNavBarWrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.homeBottomNavBar}>
          {/* Profile Tab */}
          <TouchableOpacity
            style={styles.homeBottomNavTab}
            onPress={() => setActiveBottomTab('profile')}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.homeBottomNavIcon,
                activeBottomTab === 'profile' && styles.homeBottomNavIconActive,
              ]}
            >
              👤
            </Text>
            <Text
              style={[
                styles.homeBottomNavLabel,
                activeBottomTab === 'profile' && styles.homeBottomNavLabelActive,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>

          {/* Orders Tab */}
          <TouchableOpacity
            style={styles.homeBottomNavTab}
            onPress={onNavigateToOrders}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.homeBottomNavIcon,
                activeBottomTab === 'orders' && styles.homeBottomNavIconActive,
              ]}
            >
              📦
            </Text>
            <Text
              style={[
                styles.homeBottomNavLabel,
                activeBottomTab === 'orders' && styles.homeBottomNavLabelActive,
              ]}
            >
              Orders
            </Text>
          </TouchableOpacity>

          {/* Deposit Tab */}
          <TouchableOpacity
            style={styles.homeBottomNavTab}
            onPress={() => {
              setActiveBottomTab('deposit');
              if (onNavigateToDeposit) onNavigateToDeposit();
            }}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.homeBottomNavIcon,
                activeBottomTab === 'deposit' && styles.homeBottomNavIconActive,
              ]}
            >
              💵
            </Text>
            <Text
              style={[
                styles.homeBottomNavLabel,
                activeBottomTab === 'deposit' && styles.homeBottomNavLabelActive,
              ]}
            >
              Deposit
            </Text>
          </TouchableOpacity>

          {/* Account Tab */}
          <TouchableOpacity
            style={styles.homeBottomNavTab}
            onPress={() => {
              setActiveBottomTab('account');
              if (onNavigateToAccount) onNavigateToAccount();
            }}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.homeBottomNavIcon,
                activeBottomTab === 'account' && styles.homeBottomNavIconActive,
              ]}
            >
              👤
            </Text>
            <Text
              style={[
                styles.homeBottomNavLabel,
                activeBottomTab === 'account' && styles.homeBottomNavLabelActive,
              ]}
            >
              Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
