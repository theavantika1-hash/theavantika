import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/appStyles';
import { MapScreen, mapCanvasStyles } from './MapScreen';
import { deliveryBoyApi } from '../config/api';
import { OrderMapView } from '../components/OrderMapView';

interface OrderItem {
  id: string;
  orderNo: string;
  restaurantName: string;
  restaurantAddress: string;
  deliveryName: string;
  deliveryAddress: string;
  distance: string;
  amount: string;
  paymentType: string;
  itemsText: string;
  receivedTime: string;
  deliveryTime: string;
  status: 'new' | 'active';
}

interface OrdersScreenProps {
  userEmail?: string;
  onNavigateTab: (tab: 'profile' | 'orders' | 'deposit' | 'account') => void;
  onNavigateToMap?: () => void;
  onNavigateToDetail?: () => void;
  onNavigateToNotifications?: () => void;
}

export function OrdersScreen({
  userEmail,
  onNavigateTab,
  onNavigateToMap,
  onNavigateToDetail,
  onNavigateToNotifications,
}: OrdersScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeSubTab, setActiveSubTab] = useState<'new' | 'active' | 'map'>('new');
  const [ordersList, setOrdersList] = useState<OrderItem[]>([]);
  const [currentOrderBanner, setCurrentOrderBanner] = useState<{
    orderNo: string;
    statusTitle: string;
    pickupTag: string;
    timeLeft: string;
  } | null>(null);

  // Poll Assigned Orders from Backend Database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await deliveryBoyApi.getAssignedOrders(userEmail);
        if (res.data) {
          const fetchedOrders = Array.isArray(res.data) ? res.data : (res.data.orders || []);
          const fetchedCurrentOrder = res.data.currentOrder || null;
          setOrdersList(fetchedOrders);
          setCurrentOrderBanner(fetchedCurrentOrder);
          const hasNew = fetchedOrders.some((o: OrderItem) => o.status === 'new');
          if (hasNew) {
            setActiveSubTab('new');
          }
        }
      } catch (err) {
        console.error('Error fetching assigned orders:', err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [userEmail]);

  const filteredOrders = ordersList.filter(order =>
    activeSubTab === 'map' ? true : order.status === activeSubTab
  );

  const handleAcceptOrder = async (id: string, orderNo: string) => {
    setOrdersList(prev =>
      prev.map(o => (o.id === id ? { ...o, status: 'active' } : o))
    );
    setActiveSubTab('active');
    try {
      await deliveryBoyApi.updateOrderStatus(id, 'Out for Delivery', userEmail);
    } catch (e) {
      console.error('Failed to accept order on backend:', e);
    }
    Alert.alert('Order Accepted 🎉', `Order ${orderNo} accepted! Moved to Active orders.`);
  };

  const handleDeclineOrder = async (id: string, orderNo: string) => {
    setOrdersList(prev => prev.filter(o => o.id !== id));
    try {
      await deliveryBoyApi.updateOrderStatus(id, 'Declined', userEmail);
    } catch (e) {
      console.error('Failed to decline order on backend:', e);
    }
    Alert.alert('Order Declined', `Order ${orderNo} declined.`);
  };

  const handleCallCustomer = (orderNo: string) => {
    Alert.alert('Calling Customer', `Dialing customer for order ${orderNo}...`);
  };

  const handleOpenMap = (address: string) => {
    setActiveSubTab('map');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.homeScrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* TOP TEAL CURVED HEADER */}
        <View style={[styles.homeTopHeader, { paddingTop: Math.max(insets.top + 8, 20) }]}>
          <View style={styles.homeHeaderTopRow}>
            {/* App Brand */}
            <View style={styles.homeBrandRow}>
              <View style={styles.homeUtensilCircle}>
                <Text style={{ fontSize: 16 }}>🍴</Text>
              </View>
              <Text style={styles.homeBrandTitle}>Food Love</Text>
            </View>

            {/* Order History Button */}
            <TouchableOpacity style={styles.orderHistoryHeaderBtn} activeOpacity={0.8}>
              <Text style={{ fontSize: 16, marginRight: 6 }}>⏱</Text>
              <Text style={styles.orderHistoryHeaderBtnText}>Order History</Text>
            </TouchableOpacity>

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

        {/* DYNAMIC REAL FLOATING LIVE ORDER BANNER CARD */}
        {currentOrderBanner && (
          <View style={styles.homeProfileCardWrapper}>
            <View style={styles.orderLiveBannerCard}>
              <View style={styles.orderLiveBannerTopRow}>
                <View style={styles.orderNoPillBadge}>
                  <Text style={styles.orderNoPillBadgeText}>Order {currentOrderBanner.orderNo}</Text>
                </View>
                <View style={styles.orderTimeLeftRow}>
                  <Text style={{ fontSize: 14, marginRight: 4 }}>⏱</Text>
                  <Text style={styles.orderTimeLeftText}>{currentOrderBanner.timeLeft || '30 mins left'}</Text>
                </View>
              </View>

              <Text style={styles.orderStatusReadyTitle}>{currentOrderBanner.statusTitle || 'Order Ready by Restaurant'}</Text>

              <View style={styles.orderReadyBottomRow}>
                <View style={styles.readyToPickupTag}>
                  <Text style={styles.readyToPickupTagText}>{currentOrderBanner.pickupTag || 'Ready to Pickup'}</Text>
                </View>

                <View style={styles.orderBannerDotsRow}>
                  <View style={[styles.homeChartDot, styles.homeChartDotActive]} />
                  <View style={styles.homeChartDot} />
                  <View style={styles.homeChartDot} />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ORDERS SUB-TABS: New / Active (with red dot) / Map */}

        <View style={styles.homeTabsRow}>
          <TouchableOpacity
            style={styles.homeTabItem}
            onPress={() => setActiveSubTab('new')}
            activeOpacity={0.8}
          >
            <Text style={[styles.homeTabText, activeSubTab === 'new' && styles.homeTabTextActive]}>
              New
            </Text>
            {activeSubTab === 'new' && <View style={styles.homeTabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeTabItem}
            onPress={() => setActiveSubTab('active')}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.homeTabText, activeSubTab === 'active' && styles.homeTabTextActive]}>
                Active
              </Text>
              <View style={styles.activeTabRedDot} />
            </View>
            {activeSubTab === 'active' && <View style={styles.homeTabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeTabItem}
            onPress={() => setActiveSubTab('map')}
            activeOpacity={0.8}
          >
            <Text style={[styles.homeTabText, activeSubTab === 'map' && styles.homeTabTextActive]}>
              Map
            </Text>
            {activeSubTab === 'map' && <View style={styles.homeTabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* ORDERS LIST OR EMBEDDED MAP CONTENT */}
        <View style={styles.homeTabContentContainer}>
          {activeSubTab === 'map' ? (
            <View style={styles.embeddedMapContainer}>
              <View style={styles.embeddedMapCanvas}>
                <OrderMapView
                  restaurantName="Avantika Restaurant"
                  restaurantAddress="SH 25, Bhagwanpura, Alwar"
                  deliveryAddress="#744, UE, Phase-II, Alwar"
                  totalDistance="3.5 km"
                  timeRemaining="18 mins"
                  orderStatus="Active Route Map"
                  onCenterLocation={() => {
                    if (onNavigateToMap) onNavigateToMap();
                  }}
                />

                {/* Top Right Expand Icon Button */}
                <TouchableOpacity
                  style={styles.mapExpandBtn}
                  onPress={() => {
                    if (onNavigateToMap) onNavigateToMap();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 18, color: '#1E293B' }}>⤢</Text>
                </TouchableOpacity>

                {/* Bottom Overlay Card */}
                <View style={styles.mapFloatingCard}>
                  <View style={styles.mapLocationHeaderRow}>
                    <View style={styles.mapLocationRedPinBox}>
                      <Text style={styles.mapLocationRedPinIcon}>📍</Text>
                    </View>

                    <View style={styles.mapLocationTextCol}>
                      <Text style={styles.mapLocationTitleRed}>Location</Text>
                      <Text style={styles.mapLocationSubtitle} numberOfLines={1}>
                        #321, Phase-II, UE, Ludhiana, India...
                      </Text>
                    </View>
                  </View>

                  <View style={styles.mapStatsYellowBox}>
                    <View style={styles.mapStatCol}>
                      <View style={styles.mapStatValRow}>
                        <Text style={styles.mapStatValueText}>4</Text>
                      </View>
                      <Text style={styles.mapStatLabelText}>Active Orders</Text>
                    </View>

                    <View style={styles.mapStatDividerLine} />

                    <View style={styles.mapStatCol}>
                      <View style={styles.mapStatValRow}>
                        <Text style={styles.mapStatValueText}>12.5</Text>
                        <Text style={styles.mapStatKmUnit}>km</Text>
                      </View>
                      <Text style={styles.mapStatLabelText}>Total Distance</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : filteredOrders.length === 0 ? (
            <View style={styles.emptyOrdersContainer}>
              <Text style={{ fontSize: 40, marginBottom: 8 }}>📦</Text>
              <Text style={styles.emptyOrdersText}>No {activeSubTab} orders available</Text>
            </View>
          ) : (
            filteredOrders.map(order => (
              <View key={order.id} style={styles.orderCardItemContainer}>
                {/* Restaurant & Delivery Address Section */}
                <View style={styles.orderCardTopRow}>
                  <View style={styles.orderPinCol}>
                    <Text style={{ fontSize: 18 }}>📍</Text>
                    <View style={styles.orderDottedConnectorLine} />
                    <Text style={{ fontSize: 18 }}>📍</Text>
                  </View>

                  <View style={styles.orderAddressCol}>
                    {/* Restaurant Row */}
                    <View style={styles.orderRestaurantRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.orderRestaurantTitle}>{order.restaurantName}</Text>
                        <Text style={styles.orderAddressSubtitle}>{order.restaurantAddress}</Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.orderAmountValue}>{order.amount}</Text>
                        <Text style={styles.orderCodTagText}>{order.paymentType}</Text>
                      </View>
                    </View>

                    {/* Destination Row */}
                    <View style={styles.orderDestinationRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.orderHomeTitle}>{order.deliveryName}</Text>
                        <Text style={styles.orderAddressSubtitle}>{order.deliveryAddress}</Text>
                      </View>

                      {order.status === 'active' ? (
                        <TouchableOpacity
                          style={styles.orderNavCircleBtn}
                          onPress={() => handleOpenMap(order.deliveryAddress)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.orderNavCircleIcon}>🧭</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.orderDistanceValText}>{order.distance}</Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Items Summary Row */}
                <View style={styles.orderItemsSummaryRow}>
                  <Text style={{ fontSize: 18, marginRight: 10 }}>🍽️</Text>
                  <Text style={styles.orderItemsSummaryText} numberOfLines={2}>
                    {order.itemsText}
                  </Text>
                </View>

                {/* Timestamps Row */}
                <View style={styles.orderTimestampsRow}>
                  <View style={styles.orderTimeBlock}>
                    <Text style={{ fontSize: 14, marginRight: 6 }}>⏱</Text>
                    <View>
                      <Text style={styles.orderTimeMetaLabel}>Order Received</Text>
                      <Text style={styles.orderTimeMetaValue}>{order.receivedTime}</Text>
                    </View>
                  </View>

                  <View style={styles.orderTimeBlock}>
                    <Text style={{ fontSize: 14, marginRight: 6 }}>⏱</Text>
                    <View>
                      <Text style={styles.orderTimeMetaLabel}>Delivery Time</Text>
                      <Text style={styles.orderTimeMetaValue}>{order.deliveryTime}</Text>
                    </View>
                  </View>
                </View>

                {/* ACTIVE ORDER ACTIONS (Ribbon Call / Details / Pickup Ready) */}
                {order.status === 'active' ? (
                  <View style={styles.activeOrderActionRow}>
                    <TouchableOpacity
                      style={styles.activeRibbonCallBtn}
                      onPress={() => handleCallCustomer(order.orderNo)}
                      activeOpacity={0.85}
                    >
                      <Text style={{ fontSize: 14 }}>📞</Text>
                      <Text style={styles.activeRibbonCallText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onNavigateToDetail ? onNavigateToDetail() : Alert.alert('Order Details', `Showing details for ${order.orderNo}`)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.activeDetailsTextLink}>Details</Text>
                    </TouchableOpacity>

                    <View style={styles.readyToPickupTag}>
                      <Text style={styles.readyToPickupTagText}>Pickup Ready</Text>
                    </View>
                  </View>
                ) : (
                  /* NEW ORDER ACTIONS (Decline / Accept) */
                  <View style={styles.orderActionButtonsRow}>
                    <TouchableOpacity
                      style={styles.orderDeclineBtn}
                      onPress={() => handleDeclineOrder(order.id, order.orderNo)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.orderDeclineBtnText}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.orderAcceptBtn}
                      onPress={() => handleAcceptOrder(order.id, order.orderNo)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.orderAcceptBtnText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* BOTTOM FLOATING NAVIGATION BAR */}
      <View style={[styles.homeBottomNavBarWrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.homeBottomNavBar}>
          {/* Profile Tab */}
          <TouchableOpacity
            style={styles.homeBottomNavTab}
            onPress={() => onNavigateTab('profile')}
            activeOpacity={0.75}
          >
            <Text style={styles.homeBottomNavIcon}>👤</Text>
            <Text style={styles.homeBottomNavLabel}>Profile</Text>
          </TouchableOpacity>

          {/* Orders Tab */}
          <TouchableOpacity
            style={styles.homeBottomNavTab}
            onPress={() => onNavigateTab('orders')}
            activeOpacity={0.75}
          >
            <Text style={[styles.homeBottomNavIcon, styles.homeBottomNavIconActive]}>📦</Text>
            <Text style={[styles.homeBottomNavLabel, styles.homeBottomNavLabelActive]}>Orders</Text>
          </TouchableOpacity>

          {/* Deposit Tab */}
          <TouchableOpacity
            style={styles.homeBottomNavTab}
            onPress={() => onNavigateTab('deposit')}
            activeOpacity={0.75}
          >
            <Text style={styles.homeBottomNavIcon}>💵</Text>
            <Text style={styles.homeBottomNavLabel}>Deposit</Text>
          </TouchableOpacity>

          {/* Account Tab */}
          <TouchableOpacity
            style={styles.homeBottomNavTab}
            onPress={() => onNavigateTab('account')}
            activeOpacity={0.75}
          >
            <Text style={styles.homeBottomNavIcon}>👤</Text>
            <Text style={styles.homeBottomNavLabel}>Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
