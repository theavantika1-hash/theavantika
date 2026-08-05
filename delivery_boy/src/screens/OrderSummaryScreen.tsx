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

interface OrderSummaryScreenProps {
  onBack?: () => void;
  orderNumber?: string;
  onNavigateToCancelModal?: () => void;
}

export function OrderSummaryScreen({
  onBack,
  orderNumber = 'Order #123546789',
  onNavigateToCancelModal,
}: OrderSummaryScreenProps) {
  const insets = useSafeAreaInsets();
  const [buttonState, setButtonState] = useState<'arrive' | 'picked_up' | 'delivered'>('arrive');

  const handleArrivePress = () => {
    if (buttonState === 'arrive') {
      setButtonState('picked_up');
      Alert.alert('Arrived at Restaurant', 'Status updated to Arrived.');
    } else if (buttonState === 'picked_up') {
      setButtonState('delivered');
      Alert.alert('Order Picked Up', 'Head to customer location!');
    } else {
      Alert.alert('Order Delivered', 'Order successfully completed!');
      if (onBack) onBack();
    }
  };

  const handleSupport = () => {
    Alert.alert('Customer Support', 'Connecting to support team...');
  };

  const handleCall = () => {
    Alert.alert('Call', 'Dialing customer...');
  };

  const handleChat = () => {
    Alert.alert('Chat', 'Opening chat support...');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* 1. TOP HEADER BAR */}
      <View style={[summaryStyles.headerBar, { paddingTop: Math.max(insets.top + 6, 16) }]}>
        <TouchableOpacity style={summaryStyles.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={summaryStyles.headerBackArrow}>←</Text>
        </TouchableOpacity>

        <Text style={summaryStyles.headerTitleText}>{orderNumber}</Text>

        <TouchableOpacity activeOpacity={0.7} onPress={handleSupport}>
          <Text style={summaryStyles.headerSupportText}>Support</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom + 20, 30),
        }}
        bounces={false}
      >
        {/* 2. ORDER DETAILS SECTION TITLE */}
        <Text style={summaryStyles.sectionTitleText}>Order Details</Text>

        {/* 3. WHITE CARD 1: ORDER DETAILS */}
        <View style={summaryStyles.cardContainer}>
          {/* Restaurant Row */}
          <View style={summaryStyles.routeRow}>
            <View style={summaryStyles.routeIconCol}>
              <Text style={{ fontSize: 18 }}>📍</Text>
            </View>
            <View style={summaryStyles.routeTextCol}>
              <Text style={summaryStyles.restaurantNameText}>Testing POS Restaurant</Text>
              <Text style={summaryStyles.subAddressText}>Location, GT Road, Punjab</Text>
            </View>
            <Text style={summaryStyles.topPriceText}>$155.00</Text>
          </View>

          {/* Dotted Vertical Connector */}
          <View style={summaryStyles.dottedLineContainer}>
            <View style={summaryStyles.dottedDot} />
            <View style={summaryStyles.dottedDot} />
            <View style={summaryStyles.dottedDot} />
          </View>

          {/* Customer Home Row */}
          <View style={summaryStyles.routeRow}>
            <View style={summaryStyles.routeIconCol}>
              <Text style={{ fontSize: 18 }}>📍</Text>
            </View>
            <View style={summaryStyles.routeTextCol}>
              <Text style={summaryStyles.homeTitleText}>Home</Text>
              <Text style={summaryStyles.subAddressText}>#744, UE, Phase-II, Ludhiana</Text>
            </View>
            <Text style={summaryStyles.topDistanceText}>3.5km</Text>
          </View>

          {/* Food Items Summary */}
          <View style={[summaryStyles.routeRow, { marginTop: 12 }]}>
            <View style={summaryStyles.routeIconCol}>
              <Text style={{ fontSize: 18 }}>🍽️</Text>
            </View>
            <View style={summaryStyles.routeTextCol}>
              <Text style={summaryStyles.foodSummaryText}>
                French Fries(1), Chicken Biryani(2), Smoky Chicken BBQ Burger(1)
              </Text>
            </View>
          </View>

          <View style={summaryStyles.dottedHorizontalDivider} />

          {/* Grid Row 1: Payment Mode / Order Status */}
          <View style={summaryStyles.gridTwoColRow}>
            <View style={{ flex: 1 }}>
              <Text style={summaryStyles.gridLabelText}>Payment Mode</Text>
              <Text style={summaryStyles.gridValueCodText}>COD</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={summaryStyles.gridLabelText}>Order Status</Text>
              <Text style={summaryStyles.gridValueTealText}>Pickup Ready</Text>
            </View>
          </View>

          <View style={summaryStyles.dottedHorizontalDivider} />

          {/* Grid Row 2: Review / Tip Earned */}
          <View style={summaryStyles.gridTwoColRow}>
            <View style={{ flex: 1 }}>
              <Text style={summaryStyles.starsRowText}>★ ★ ★ ★ ★</Text>
              <Text style={summaryStyles.gridValueRedLink}>Ask for Review</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={summaryStyles.gridLabelText}>Tip Earned</Text>
              <Text style={summaryStyles.gridValueTipText}>USD 5</Text>
            </View>
          </View>

          <View style={summaryStyles.dottedHorizontalDivider} />

          {/* Grid Row 3: Timestamps */}
          <View style={summaryStyles.gridTwoColRow}>
            <View style={{ flex: 1 }}>
              <Text style={summaryStyles.gridLabelText}>Order Placed on</Text>
              <Text style={summaryStyles.gridValueDarkText}>April 08, 10:15 PM</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={summaryStyles.gridLabelText}>Delivery Time</Text>
              <Text style={summaryStyles.gridValueDarkText}>April 08, 10:45 PM</Text>
            </View>
          </View>
        </View>

        {/* 4. WHITE CARD 2: ARRIVE TO PICKUP PROGRESS */}
        <View style={summaryStyles.cardContainer}>
          <View style={summaryStyles.progressTopRow}>
            <Text style={summaryStyles.progressStepTitle}>Arrive to Pickup</Text>
            <Text style={summaryStyles.progressStepCount}>1/5</Text>
          </View>

          {/* Progress Segments */}
          <View style={summaryStyles.progressSegmentsRow}>
            <View style={[summaryStyles.segmentBar, summaryStyles.segmentActiveTeal]} />
            <View style={[summaryStyles.segmentBar, summaryStyles.segmentActiveTeal]} />
            <View style={[summaryStyles.segmentBar, summaryStyles.segmentDarkGray]} />
            <View style={[summaryStyles.segmentBar, summaryStyles.segmentLightGray]} />
            <View style={[summaryStyles.segmentBar, summaryStyles.segmentLightGray]} />
          </View>

          <View style={summaryStyles.progressBottomRow}>
            <Text style={summaryStyles.approxPayLabel}>Approx Pay</Text>
            <Text style={summaryStyles.approxPayValueText}>USD 50</Text>
          </View>
        </View>

        {/* 5. ITEMS IN ORDER SECTION TITLE */}
        <Text style={[summaryStyles.sectionTitleText, { marginTop: 8 }]}>Items in Order</Text>

        {/* 6. WHITE CARD 3: ITEMS IN ORDER */}
        <View style={summaryStyles.cardContainer}>
          <View style={summaryStyles.itemRowContainer}>
            <View style={summaryStyles.nonVegSquareBadge}>
              <View style={summaryStyles.nonVegDot} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={summaryStyles.itemNameText}>Chicken Biryani</Text>
              <Text style={summaryStyles.itemToppingsText}>Toppings with Capsicum | Tomato</Text>
            </View>
            <Text style={summaryStyles.itemQtyText}>x2</Text>
          </View>
        </View>

        {/* 7. 3-COLUMN METRICS GRID */}
        <View style={summaryStyles.metricsGridRow}>
          <View style={summaryStyles.metricCol}>
            <View style={summaryStyles.metricValueRow}>
              <Text style={summaryStyles.metricNumber}>3.5</Text>
              <Text style={summaryStyles.metricUnit}> km</Text>
            </View>
            <Text style={summaryStyles.metricLabel}>Total Distance</Text>
          </View>

          <View style={summaryStyles.metricVerticalDivider} />

          <View style={summaryStyles.metricCol}>
            <View style={summaryStyles.metricValueRow}>
              <Text style={summaryStyles.metricNumber}>20</Text>
              <Text style={summaryStyles.metricUnit}> mins</Text>
            </View>
            <Text style={summaryStyles.metricLabel}>Time Remaining</Text>
          </View>

          <View style={summaryStyles.metricVerticalDivider} />

          <View style={summaryStyles.metricCol}>
            <View style={summaryStyles.metricValueRow}>
              <Text style={summaryStyles.metricNumber}>2.12</Text>
              <Text style={summaryStyles.metricUnit}> km</Text>
            </View>
            <Text style={summaryStyles.metricLabel}>Distance Away</Text>
          </View>
        </View>

        {/* 8. ACTIONS ROW */}
        <View style={summaryStyles.actionsRow}>
          <TouchableOpacity style={summaryStyles.actionBtnTouch} onPress={handleCall} activeOpacity={0.8}>
            <View style={summaryStyles.actionIconBox}>
              <Text style={{ fontSize: 14 }}>📞</Text>
            </View>
            <Text style={summaryStyles.actionBtnText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={summaryStyles.actionBtnTouch} onPress={handleChat} activeOpacity={0.8}>
            <View style={summaryStyles.actionIconBox}>
              <Text style={{ fontSize: 14 }}>💬</Text>
            </View>
            <Text style={summaryStyles.actionBtnText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNavigateToCancelModal}
            activeOpacity={0.7}
            style={{ paddingVertical: 8 }}
          >
            <Text style={summaryStyles.cancelOrderText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>

        {/* 9. MAIN ACTION BUTTON */}
        <TouchableOpacity
          style={summaryStyles.arriveBtn}
          onPress={handleArrivePress}
          activeOpacity={0.85}
        >
          <Text style={summaryStyles.arriveBtnText}>
            {buttonState === 'arrive'
              ? 'Arrive to Pickup'
              : buttonState === 'picked_up'
              ? 'Mark Picked Up'
              : 'Complete Delivery'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackArrow: {
    fontSize: 24,
    color: '#1E293B',
    fontWeight: '700',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  headerSupportText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3500',
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3500',
    marginBottom: 12,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeIconCol: {
    width: 28,
    alignItems: 'center',
    paddingTop: 2,
  },
  routeTextCol: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  restaurantNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  homeTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  subAddressText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  topPriceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF3500',
  },
  topDistanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  dottedLineContainer: {
    marginLeft: 13,
    marginVertical: 2,
  },
  dottedDot: {
    width: 2,
    height: 3,
    backgroundColor: '#CBD5E1',
    marginVertical: 2,
    borderRadius: 1,
  },
  foodSummaryText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  dottedHorizontalDivider: {
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
    marginVertical: 14,
  },
  gridTwoColRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  gridLabelText: {
    fontSize: 12,
    color: '#64748B',
  },
  gridValueCodText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF3500',
    marginTop: 2,
  },
  gridValueTealText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D9488',
    marginTop: 2,
  },
  starsRowText: {
    fontSize: 13,
    color: '#CBD5E1',
  },
  gridValueRedLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF3500',
    marginTop: 2,
  },
  gridValueTipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF3500',
    marginTop: 2,
  },
  gridValueDarkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 2,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressStepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  progressStepCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  progressSegmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  segmentBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  segmentActiveTeal: {
    backgroundColor: '#0D9488',
  },
  segmentDarkGray: {
    backgroundColor: '#1E293B',
  },
  segmentLightGray: {
    backgroundColor: '#E2E8F0',
  },
  progressBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  approxPayLabel: {
    fontSize: 14,
    color: '#1E293B',
  },
  approxPayValueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF3500',
  },
  itemRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nonVegSquareBadge: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nonVegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  itemNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  itemToppingsText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  itemQtyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  metricsGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 14,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  metricVerticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  actionBtnTouch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FF3500',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  cancelOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3500',
  },
  arriveBtn: {
    backgroundColor: '#FF3500',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  arriveBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
