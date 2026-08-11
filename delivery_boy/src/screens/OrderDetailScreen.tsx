import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mapCanvasStyles } from './MapScreen';
import { OrderMapView } from '../components/OrderMapView';
import { deliveryBoyApi } from '../config/api';

interface OrderDetailScreenProps {
  onBack?: () => void;
  onNavigateToTracking?: () => void;
  userEmail?: string;
  riderName?: string;
  orderNumber?: string;
  customerName?: string;
  customerAddress?: string;
  amount?: string;
  paymentMethod?: string;
  restaurantName?: string;
  restaurantAddress?: string;
  deliveryAddress?: string;
  itemsSummary?: string;
  notes?: string;
  totalDistance?: string;
  timeRemaining?: string;
  distanceAway?: string;
}

export function OrderDetailScreen({
  onBack,
  onNavigateToTracking,
  userEmail,
  riderName,
  orderNumber = 'Order #123546789',
  customerName = 'John Doe',
  customerAddress = '#421, Phase-II, UE, Ludhiana, India...',
  amount = '$150.50',
  paymentMethod = 'COD',
  restaurantName = 'Testing POS Restaurant',
  restaurantAddress = 'GT Road, Ludhiana.',
  deliveryAddress = '#744, UE, Phase-II, Ludhiana',
  itemsSummary = 'French Fries(1), Chicken Biryani(2), Smoky Chicken BBQ Burger(1)',
  notes = 'Prefer Salted, Less Spicy, without Gravy',
  totalDistance = '3.5',
  timeRemaining = '20',
  distanceAway = '2.12',
}: OrderDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const [buttonState, setButtonState] = useState<'arrive' | 'picked_up' | 'delivered'>('arrive');
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [sheetMode, setSheetMode] = useState<'minimized' | 'standard' | 'expanded'>('standard');

  // Real Delivery Boy Rider Name State
  const [realRiderName, setRealRiderName] = useState<string>(riderName || 'Delivery Executive (You)');

  React.useEffect(() => {
    if (userEmail) {
      deliveryBoyApi.getProfile(userEmail).then(res => {
        const name = res?.data?.fullName || res?.data?.name;
        if (name) {
          setRealRiderName(`${name} (You)`);
        }
      }).catch(() => {});
    }
  }, [userEmail]);

  const sheetPanResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 40) {
          // Dragged DOWN -> Minimize sheet to reveal complete map view
          setSheetMode(prev => (prev === 'expanded' ? 'standard' : 'minimized'));
        } else if (gestureState.dy < -40) {
          // Dragged UP -> Expand sheet to show details
          setSheetMode(prev => (prev === 'minimized' ? 'standard' : 'expanded'));
        }
      },
    })
  ).current;

  const [selectedReason, setSelectedReason] = useState<'contact' | 'distance' | 'other'>('distance');
  const [reasonText, setReasonText] = useState(
    'Customer Location is misleading and too far, not accurate as given and not fall in my area.'
  );

  const handleArrivePress = async () => {
    const cleanId = (orderNumber || '').replace(/^Order\s*#/i, '').trim();
    if (buttonState === 'arrive') {
      setButtonState('picked_up');
      try {
        await deliveryBoyApi.updateOrderStatus(cleanId, 'ARRIVED_AT_RESTAURANT');
      } catch (e) {}
      Alert.alert('Arrived at Restaurant', 'Status updated to Arrived at Restaurant.');
    } else if (buttonState === 'picked_up') {
      setButtonState('delivered');
      try {
        await deliveryBoyApi.updateOrderStatus(cleanId, 'PICKED_UP');
      } catch (e) {}
      Alert.alert('Order Picked Up', 'Destination updated to Customer address!');
    } else {
      try {
        await deliveryBoyApi.updateOrderStatus(cleanId, 'DELIVERED');
      } catch (e) {}
      Alert.alert('Order Delivered', 'Order successfully completed!');
      if (onBack) onBack();
    }
  };


  const handleCall = () => {
    Alert.alert('Call Customer', 'Dialing John Doe...');
  };

  const handleChat = () => {
    Alert.alert('Chat', 'Opening chat with John Doe...');
  };

  const handleCancelClick = () => {
    setIsCancelModalVisible(true);
  };

  const handleConfirmCancelOrder = () => {
    Alert.alert('Order Cancelled', 'The order has been cancelled successfully.');
    setIsCancelModalVisible(false);
    if (onBack) onBack();
  };

  const toggleSheetMode = () => {
    setSheetMode(prev => (prev === 'minimized' ? 'standard' : prev === 'standard' ? 'minimized' : 'standard'));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* 1. TOP HEADER BAR */}
      <View style={[detailStyles.headerBar, { paddingTop: Math.max(insets.top + 6, 16) }]}>
        <TouchableOpacity
          style={detailStyles.headerBackBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={detailStyles.headerBackArrow}>←</Text>
        </TouchableOpacity>

        <Text style={detailStyles.headerTitleText}>{orderNumber}</Text>

        <TouchableOpacity activeOpacity={0.7} onPress={() => setSheetMode(prev => prev === 'expanded' ? 'standard' : 'expanded')}>
          <Text style={detailStyles.headerMoreInfoText}>
            {sheetMode === 'expanded' ? 'Map View' : 'More Info'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, position: 'relative' }}>
        {/* 2. DYNAMIC MAP VIEW */}
        <View style={StyleSheet.absoluteFill}>
          <OrderMapView
            orderId={(orderNumber || '').replace(/^Order\s*#/i, '').trim()}
            orderNumber={orderNumber}
            riderName={realRiderName}
            customerName={customerName}
            restaurantName={restaurantName}
            restaurantAddress={restaurantAddress}
            deliveryAddress={deliveryAddress}
            totalDistance={`${totalDistance} km`}
            timeRemaining={`${timeRemaining} mins`}
            orderStatus={buttonState === 'arrive' ? 'Head to Restaurant' : buttonState === 'picked_up' ? 'Order Picked Up' : 'Delivered'}
            onCenterLocation={() => Alert.alert('GPS Location Centered', 'Map view centered on current rider GPS location.')}
            hideOverlayCard={true}
          />
        </View>

        {/* 3. SLIDING DRAGGABLE BOTTOM SHEET */}
        <View
          style={[
            detailStyles.bottomSheetPopupContainer,
            sheetMode === 'expanded'
              ? detailStyles.bottomSheetFullExpanded
              : sheetMode === 'minimized'
              ? detailStyles.bottomSheetMinimized
              : detailStyles.bottomSheetCollapsed,
          ]}
        >
          {/* DRAGGABLE HANDLE BAR AT TOP OF SHEET */}
          <View {...sheetPanResponder.panHandlers} style={detailStyles.dragHandleTouchable}>
            <TouchableOpacity onPress={toggleSheetMode} activeOpacity={0.7} style={detailStyles.dragHandleInner}>
              <View style={detailStyles.dragHandleBar} />
              <Text style={detailStyles.dragHintText}>
                {sheetMode === 'minimized'
                  ? '🗺️ Complete Map View (Swipe UP or Tap to Expand Details 🔼)'
                  : sheetMode === 'expanded'
                  ? '🔽 Swipe DOWN for Map View'
                  : '🗺️ Drag DOWN for Complete Map View 🔽'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 4,
              paddingBottom: Math.max(insets.bottom + 20, 30),
            }}
            bounces={false}
          >
            {sheetMode !== 'expanded' ? (
              /* --- STANDARD COLLAPSED POPUP CONTENT --- */
              <>
                {/* Customer & Price Row */}
                <View style={detailStyles.customerPriceRow}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={detailStyles.customerNameText}>{customerName}</Text>
                      <Text style={detailStyles.customerSubId}> #12345687</Text>
                    </View>
                    <Text style={detailStyles.customerAddressText} numberOfLines={1}>
                      {customerAddress}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={detailStyles.amountText}>{amount}</Text>
                    <Text style={detailStyles.codText}>{paymentMethod}</Text>
                  </View>
                </View>

                <View style={detailStyles.divider} />

                {/* Restaurant & Home Delivery Route Section */}
                <View style={detailStyles.routeSectionContainer}>
                  {/* Restaurant */}
                  <View style={detailStyles.routeRow}>
                    <View style={detailStyles.routeIconCol}>
                      <Text style={{ fontSize: 18 }}>📍</Text>
                    </View>
                    <View style={detailStyles.routeTextCol}>
                      <Text style={detailStyles.routeTitle}>{restaurantName}</Text>
                      <Text style={detailStyles.routeSubtext}>{restaurantAddress}</Text>
                    </View>
                  </View>

                  {/* Dotted Vertical Connector Line */}
                  <View style={detailStyles.dottedLineContainer}>
                    <View style={detailStyles.dottedDot} />
                    <View style={detailStyles.dottedDot} />
                    <View style={detailStyles.dottedDot} />
                  </View>

                  {/* Customer Home */}
                  <View style={detailStyles.routeRow}>
                    <View style={detailStyles.routeIconCol}>
                      <Text style={{ fontSize: 18 }}>📍</Text>
                    </View>
                    <View style={detailStyles.routeTextCol}>
                      <Text style={detailStyles.routeTitle}>Home</Text>
                      <Text style={detailStyles.routeSubtext}>{deliveryAddress}</Text>
                    </View>
                  </View>

                  {/* Items Summary Row */}
                  <View style={[detailStyles.routeRow, { marginTop: 14 }]}>
                    <View style={detailStyles.routeIconCol}>
                      <Text style={{ fontSize: 18 }}>🍽️</Text>
                    </View>
                    <View style={detailStyles.routeTextCol}>
                      <Text style={detailStyles.itemsSummaryText}>{itemsSummary}</Text>
                    </View>
                  </View>
                </View>

                <View style={detailStyles.divider} />

                {/* Notes & Status Section */}
                <View style={detailStyles.notesStatusRow}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={detailStyles.notesTitle}>Notes</Text>
                    <Text style={detailStyles.notesText}>{notes}</Text>
                  </View>

                  <View style={detailStyles.pickupReadyBadge}>
                    <Text style={detailStyles.pickupReadyText}>Pickup Ready</Text>
                  </View>
                </View>
              </>
            ) : (
              /* --- FULL EXPANDED POPUP CONTENT (ORDER SUMMARY) --- */
              <>
                {/* ORDER DETAILS SECTION */}
                <Text style={detailStyles.sectionTitleRed}>Order Details</Text>

                <View style={detailStyles.expandedCardInner}>
                  {/* Restaurant Row */}
                  <View style={detailStyles.routeRow}>
                    <View style={detailStyles.routeIconCol}>
                      <Text style={{ fontSize: 18 }}>📍</Text>
                    </View>
                    <View style={detailStyles.routeTextCol}>
                      <Text style={detailStyles.routeTitle}>{restaurantName}</Text>
                      <Text style={detailStyles.routeSubtext}>Location, GT Road, Punjab</Text>
                    </View>
                    <Text style={detailStyles.expandedTopPriceText}>$155.00</Text>
                  </View>

                  {/* Dotted Vertical Connector */}
                  <View style={detailStyles.dottedLineContainer}>
                    <View style={detailStyles.dottedDot} />
                    <View style={detailStyles.dottedDot} />
                    <View style={detailStyles.dottedDot} />
                  </View>

                  {/* Customer Home Row */}
                  <View style={detailStyles.routeRow}>
                    <View style={detailStyles.routeIconCol}>
                      <Text style={{ fontSize: 18 }}>📍</Text>
                    </View>
                    <View style={detailStyles.routeTextCol}>
                      <Text style={detailStyles.routeTitle}>Home</Text>
                      <Text style={detailStyles.routeSubtext}>{deliveryAddress}</Text>
                    </View>
                    <Text style={detailStyles.expandedTopDistanceText}>3.5km</Text>
                  </View>

                  {/* Food Items Summary */}
                  <View style={[detailStyles.routeRow, { marginTop: 12 }]}>
                    <View style={detailStyles.routeIconCol}>
                      <Text style={{ fontSize: 18 }}>🍽️</Text>
                    </View>
                    <View style={detailStyles.routeTextCol}>
                      <Text style={detailStyles.itemsSummaryText}>{itemsSummary}</Text>
                    </View>
                  </View>

                  <View style={detailStyles.dottedHorizontalDivider} />

                  {/* Grid Row 1: Payment Mode / Order Status */}
                  <View style={detailStyles.gridTwoColRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={detailStyles.gridLabelText}>Payment Mode</Text>
                      <Text style={detailStyles.gridValueCodText}>COD</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={detailStyles.gridLabelText}>Order Status</Text>
                      <Text style={detailStyles.gridValueTealText}>Pickup Ready</Text>
                    </View>
                  </View>

                  <View style={detailStyles.dottedHorizontalDivider} />

                  {/* Grid Row 2: Review / Tip Earned */}
                  <View style={detailStyles.gridTwoColRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={detailStyles.starsRowText}>★ ★ ★ ★ ★</Text>
                      <Text style={detailStyles.gridValueRedLink}>Ask for Review</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={detailStyles.gridLabelText}>Tip Earned</Text>
                      <Text style={detailStyles.gridValueTipText}>USD 5</Text>
                    </View>
                  </View>

                  <View style={detailStyles.dottedHorizontalDivider} />

                  {/* Grid Row 3: Timestamps */}
                  <View style={detailStyles.gridTwoColRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={detailStyles.gridLabelText}>Order Placed on</Text>
                      <Text style={detailStyles.gridValueDarkText}>April 08, 10:15 PM</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={detailStyles.gridLabelText}>Delivery Time</Text>
                      <Text style={detailStyles.gridValueDarkText}>April 08, 10:45 PM</Text>
                    </View>
                  </View>
                </View>

                {/* ARRIVE TO PICKUP PROGRESS CARD */}
                <View style={[detailStyles.expandedCardInner, { marginTop: 14 }]}>
                  <View style={detailStyles.progressTopRow}>
                    <Text style={detailStyles.progressStepTitle}>Arrive to Pickup</Text>
                    <Text style={detailStyles.progressStepCount}>1/5</Text>
                  </View>

                  {/* Progress Segments */}
                  <View style={detailStyles.progressSegmentsRow}>
                    <View style={[detailStyles.segmentBar, detailStyles.segmentActiveTeal]} />
                    <View style={[detailStyles.segmentBar, detailStyles.segmentActiveTeal]} />
                    <View style={[detailStyles.segmentBar, detailStyles.segmentDarkGray]} />
                    <View style={[detailStyles.segmentBar, detailStyles.segmentLightGray]} />
                    <View style={[detailStyles.segmentBar, detailStyles.segmentLightGray]} />
                  </View>

                  <View style={detailStyles.progressBottomRow}>
                    <Text style={detailStyles.approxPayLabel}>Approx Pay</Text>
                    <Text style={detailStyles.approxPayValueText}>USD 50</Text>
                  </View>
                </View>

                {/* ITEMS IN ORDER SECTION */}
                <Text style={[detailStyles.sectionTitleRed, { marginTop: 16 }]}>Items in Order</Text>

                <View style={[detailStyles.expandedCardInner, { marginTop: 8 }]}>
                  <View style={detailStyles.itemRowContainer}>
                    <View style={detailStyles.nonVegSquareBadge}>
                      <View style={detailStyles.nonVegDot} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={detailStyles.itemNameText}>Chicken Biryani</Text>
                      <Text style={detailStyles.itemToppingsText}>Toppings with Capsicum | Tomato</Text>
                    </View>
                    <Text style={detailStyles.itemQtyText}>x2</Text>
                  </View>
                </View>
              </>
            )}

            <View style={detailStyles.divider} />

            {/* 3-COLUMN METRICS GRID */}
            <View style={detailStyles.metricsGridRow}>
              <View style={detailStyles.metricCol}>
                <View style={detailStyles.metricValueRow}>
                  <Text style={detailStyles.metricNumber}>{totalDistance}</Text>
                  <Text style={detailStyles.metricUnit}> km</Text>
                </View>
                <Text style={detailStyles.metricLabel}>Total Distance</Text>
              </View>

              <View style={detailStyles.metricVerticalDivider} />

              <View style={detailStyles.metricCol}>
                <View style={detailStyles.metricValueRow}>
                  <Text style={detailStyles.metricNumber}>{timeRemaining}</Text>
                  <Text style={detailStyles.metricUnit}> mins</Text>
                </View>
                <Text style={detailStyles.metricLabel}>Time Remaining</Text>
              </View>

              <View style={detailStyles.metricVerticalDivider} />

              <View style={detailStyles.metricCol}>
                <View style={detailStyles.metricValueRow}>
                  <Text style={detailStyles.metricNumber}>{distanceAway}</Text>
                  <Text style={detailStyles.metricUnit}> km</Text>
                </View>
                <Text style={detailStyles.metricLabel}>Distance Away</Text>
              </View>
            </View>

            {/* ACTIONS ROW */}
            <View style={detailStyles.actionsRow}>
              <TouchableOpacity style={detailStyles.actionBtnTouch} onPress={handleCall} activeOpacity={0.8}>
                <View style={detailStyles.actionIconBox}>
                  <Text style={{ fontSize: 14 }}>📞</Text>
                </View>
                <Text style={detailStyles.actionBtnText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity style={detailStyles.actionBtnTouch} onPress={handleChat} activeOpacity={0.8}>
                <View style={detailStyles.actionIconBox}>
                  <Text style={{ fontSize: 14 }}>💬</Text>
                </View>
                <Text style={detailStyles.actionBtnText}>Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCancelClick} activeOpacity={0.7} style={{ paddingVertical: 8 }}>
                <Text style={detailStyles.cancelOrderText}>Cancel Order</Text>
              </TouchableOpacity>
            </View>

            {/* MAIN ACTION BUTTON */}
            <TouchableOpacity
              style={detailStyles.arriveBtn}
              onPress={handleArrivePress}
              activeOpacity={0.85}
            >
              <Text style={detailStyles.arriveBtnText}>
                {buttonState === 'arrive'
                  ? 'Arrive to Pickup'
                  : buttonState === 'picked_up'
                  ? 'Mark Picked Up'
                  : 'Complete Delivery'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* CANCEL ORDER BOTTOM SHEET MODAL */}
      <Modal
        visible={isCancelModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCancelModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsCancelModalVisible(false)}>
          <View style={cancelModalStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[cancelModalStyles.modalCard, { paddingBottom: Math.max(insets.bottom + 20, 24) }]}>
                {/* Red Circular Floating Close Button at top right */}
                <TouchableOpacity
                  style={cancelModalStyles.closeBtnCircle}
                  onPress={() => setIsCancelModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={cancelModalStyles.closeBtnIcon}>✕</Text>
                </TouchableOpacity>

                {/* Modal Title Bar */}
                <View style={cancelModalStyles.modalHeaderRow}>
                  <Text style={cancelModalStyles.modalTitleText}>Cancel Order</Text>
                </View>

                {/* Option 1: Unable to contact customer */}
                <TouchableOpacity
                  style={cancelModalStyles.radioOptionRow}
                  onPress={() => setSelectedReason('contact')}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      cancelModalStyles.radioCircle,
                      selectedReason === 'contact' && cancelModalStyles.radioCircleSelected,
                    ]}
                  >
                    {selectedReason === 'contact' && (
                      <Text style={cancelModalStyles.radioCheckIcon}>✓</Text>
                    )}
                  </View>
                  <Text style={cancelModalStyles.radioOptionLabel}>
                    Unable to contact customer
                  </Text>
                </TouchableOpacity>

                {/* Option 2: Deliver Location is more than the preferred distance specified */}
                <TouchableOpacity
                  style={cancelModalStyles.radioOptionRow}
                  onPress={() => setSelectedReason('distance')}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      cancelModalStyles.radioCircle,
                      selectedReason === 'distance' && cancelModalStyles.radioCircleSelected,
                    ]}
                  >
                    {selectedReason === 'distance' && (
                      <Text style={cancelModalStyles.radioCheckIcon}>✓</Text>
                    )}
                  </View>
                  <Text style={cancelModalStyles.radioOptionLabel}>
                    Deliver Location is more than the preferred distance specified
                  </Text>
                </TouchableOpacity>

                {/* Option 3: Other */}
                <TouchableOpacity
                  style={cancelModalStyles.radioOptionRow}
                  onPress={() => setSelectedReason('other')}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      cancelModalStyles.radioCircle,
                      selectedReason === 'other' && cancelModalStyles.radioCircleSelected,
                    ]}
                  >
                    {selectedReason === 'other' && (
                      <Text style={cancelModalStyles.radioCheckIcon}>✓</Text>
                    )}
                  </View>
                  <Text style={cancelModalStyles.radioOptionLabel}>Other</Text>
                </TouchableOpacity>

                {/* Reason Details Input Container */}
                <View style={cancelModalStyles.reasonInputBox}>
                  <TextInput
                    style={cancelModalStyles.reasonTextInput}
                    multiline
                    value={reasonText}
                    onChangeText={setReasonText}
                    placeholder="Enter reason for cancellation..."
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                {/* Action Button: Cancel Order */}
                <TouchableOpacity
                  style={cancelModalStyles.modalCancelBtn}
                  onPress={handleConfirmCancelOrder}
                  activeOpacity={0.85}
                >
                  <Text style={cancelModalStyles.modalCancelBtnText}>Cancel Order</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 20,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  headerMoreInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3500',
  },
  darkTooltipPill: {
    position: 'absolute',
    top: '20%',
    left: '30%',
    backgroundColor: '#27272A',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  darkTooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  mapTargetBtn: {
    position: 'absolute',
    top: '32%',
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    zIndex: 5,
  },
  bottomSheetPopupContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  bottomSheetMinimized: {
    top: '84%',
  },
  bottomSheetCollapsed: {
    top: '42%',
  },
  bottomSheetFullExpanded: {
    top: 64,
  },
  dragHandleTouchable: {
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  dragHandleInner: {
    alignItems: 'center',
    width: '100%',
  },
  dragHintText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  dragHandleBar: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
  },
  customerPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  customerNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  customerSubId: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
  },
  customerAddressText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  codText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF3500',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  routeSectionContainer: {
    marginVertical: 2,
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
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  routeSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
  itemsSummaryText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  notesStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  notesText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  pickupReadyBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pickupReadyText: {
    color: '#0D9488',
    fontSize: 12,
    fontWeight: '700',
  },

  /* EXPANDED POPUP STYLES */
  sectionTitleRed: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3500',
    marginBottom: 12,
  },
  expandedCardInner: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  expandedTopPriceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF3500',
  },
  expandedTopDistanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  dottedHorizontalDivider: {
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
    marginVertical: 12,
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
    backgroundColor: '#CBD5E1',
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
    marginVertical: 4,
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
    marginTop: 18,
    marginBottom: 18,
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

const cancelModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    position: 'relative',
  },
  closeBtnCircle: {
    position: 'absolute',
    top: -18,
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FF3500',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closeBtnIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalHeaderRow: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 20,
  },
  modalTitleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  radioOptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingRight: 10,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
    backgroundColor: '#FFFFFF',
  },
  radioCircleSelected: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  radioCheckIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  radioOptionLabel: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
    fontWeight: '500',
  },
  reasonInputBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: 8,
    marginBottom: 24,
  },
  reasonTextInput: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    textAlignVertical: 'top',
    padding: 0,
  },
  modalCancelBtn: {
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
  modalCancelBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
