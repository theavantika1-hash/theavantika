import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OrderTrackingScreenProps {
  onBack?: () => void;
  orderNumber?: string;
  awayDistance?: string;
  etaMins?: string;
}

export function OrderTrackingScreen({
  onBack,
  orderNumber = 'Order #123546789',
  awayDistance = '3.5 km',
  etaMins = '25 mins',
}: OrderTrackingScreenProps) {
  const insets = useSafeAreaInsets();

  const handleSupport = () => {
    Alert.alert('Customer Support', 'Connecting to support team...');
  };

  return (
    <View style={trackingStyles.container}>
      {/* 1. TOP HEADER BAR */}
      <View style={[trackingStyles.headerBar, { paddingTop: Math.max(insets.top + 6, 16) }]}>
        <TouchableOpacity style={trackingStyles.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={trackingStyles.headerBackArrow}>←</Text>
        </TouchableOpacity>

        <Text style={trackingStyles.headerTitleText}>{orderNumber}</Text>

        <TouchableOpacity activeOpacity={0.7} onPress={handleSupport}>
          <Text style={trackingStyles.headerSupportText}>Support</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* 2. MAP SECTION */}
        <View style={trackingStyles.mapCanvasContainer}>
          {/* Topographical Map Vector Representation */}
          <View style={trackingStyles.mapCanvas}>
            {/* Green Hills & Contours */}
            <View style={trackingStyles.greenParkRegion} />
            <View style={trackingStyles.hillContourA} />
            <View style={trackingStyles.hillContourB} />

            {/* Highway Lines */}
            <View style={trackingStyles.highwayLineOrange} />

            {/* Highway Badge Symbols */}
            <View style={[trackingStyles.highwayBadge, { top: '15%', left: '6%' }]}>
              <Text style={trackingStyles.highwayBadgeText}>80</Text>
            </View>
            <View style={[trackingStyles.highwayBadge, { bottom: '32%', left: '16%' }]}>
              <Text style={trackingStyles.highwayBadgeText}>80</Text>
            </View>

            {/* Road Label Text */}
            <Text style={[trackingStyles.roadLabel, { top: '20%', left: '8%' }]}>
              Testing POS Restaurant
            </Text>

            {/* Red Pin for Restaurant */}
            <View style={[trackingStyles.pinContainer, { top: '22%', left: '21%' }]}>
              <Text style={{ fontSize: 24 }}>📍</Text>
            </View>

            {/* Route Connecting Line */}
            <View style={trackingStyles.routeSegmentA} />
            <View style={trackingStyles.routeSegmentB} />
            <View style={trackingStyles.routeSegmentC} />

            {/* Current Location Red Solid Dot */}
            <View style={trackingStyles.currentLocationDot} />

            {/* YOU ARE HERE! Dark Callout Badge */}
            <View style={trackingStyles.darkCalloutBadge}>
              <Text style={trackingStyles.calloutTitleText}>You are Here!</Text>
              <Text style={trackingStyles.calloutSubtitleText}>NH5, Pluton Authorised Store</Text>
              <View style={trackingStyles.calloutArrowDown} />
            </View>

            {/* Target Destination Ring Icon */}
            <View style={trackingStyles.targetRingContainer}>
              <View style={trackingStyles.targetRingOuter}>
                <View style={trackingStyles.targetRingInner} />
              </View>
              <View style={trackingStyles.targetRingStem} />
            </View>
          </View>
        </View>

        {/* 3. WHITE SHEET OVERLAY */}
        <View
          style={[
            trackingStyles.bottomSheetContainer,
            { paddingBottom: Math.max(insets.bottom + 24, 32) },
          ]}
        >
          {/* Sheet Handle */}
          <View style={trackingStyles.sheetHandleRow}>
            <View style={trackingStyles.sheetHandleBar} />
          </View>

          {/* Away Distance & ETA Metrics */}
          <View style={trackingStyles.metricsRow}>
            <View style={{ flex: 1 }}>
              <Text style={trackingStyles.metricLabelText}>Away Distance</Text>
              <Text style={trackingStyles.metricValueText}>{awayDistance}</Text>
            </View>

            <View style={{ flex: 1, paddingLeft: 24 }}>
              <Text style={trackingStyles.metricLabelText}>ETA</Text>
              <Text style={trackingStyles.metricValueText}>{etaMins}</Text>
            </View>
          </View>

          <View style={trackingStyles.dividerLine} />

          {/* VERTICAL TIMELINE STEPPER */}
          <View style={trackingStyles.timelineContainer}>
            {/* Step 1: Accepted Order */}
            <View style={trackingStyles.timelineItem}>
              <View style={trackingStyles.timelineLeftCol}>
                <View style={trackingStyles.dotRedSolid} />
                <View style={trackingStyles.lineRedVertical} />
              </View>
              <View style={trackingStyles.timelineRightCol}>
                <View style={trackingStyles.timelineHeaderRow}>
                  <Text style={trackingStyles.stepTitleBold}>Accepted Order</Text>
                  <Text style={trackingStyles.stepTimeText}>01:45 PM</Text>
                </View>
                <Text style={trackingStyles.stepSubtitleText}>You have accepted the order</Text>
              </View>
            </View>

            {/* Step 2: Order Prepared */}
            <View style={trackingStyles.timelineItem}>
              <View style={trackingStyles.timelineLeftCol}>
                <View style={trackingStyles.dotRedSolid} />
                <View style={trackingStyles.lineRedVertical} />
              </View>
              <View style={trackingStyles.timelineRightCol}>
                <View style={trackingStyles.timelineHeaderRow}>
                  <Text style={trackingStyles.stepTitleBold}>Order Prepared</Text>
                  <Text style={trackingStyles.stepTimeText}>02:05 PM</Text>
                </View>
                <Text style={trackingStyles.stepSubtitleText}>
                  Order is prepared and ready by restaurant
                </Text>
              </View>
            </View>

            {/* Step 3: Pickup Order */}
            <View style={trackingStyles.timelineItem}>
              <View style={trackingStyles.timelineLeftCol}>
                <View style={trackingStyles.dotRedRingContainer}>
                  <View style={trackingStyles.dotRedRingInner} />
                </View>
                <View style={trackingStyles.lineGrayVertical} />
              </View>
              <View style={trackingStyles.timelineRightCol}>
                <View style={trackingStyles.timelineHeaderRow}>
                  <Text style={trackingStyles.stepTitleBold}>Pickup Order</Text>
                  <Text style={trackingStyles.stepTimeText}>02:09 PM</Text>
                </View>
              </View>
            </View>

            {/* Step 4: On the way */}
            <View style={trackingStyles.timelineItem}>
              <View style={trackingStyles.timelineLeftCol}>
                <View style={trackingStyles.dotGraySolid} />
                <View style={trackingStyles.lineGrayVertical} />
              </View>
              <View style={trackingStyles.timelineRightCol}>
                <Text style={trackingStyles.stepTitleMedium}>On the way</Text>
              </View>
            </View>

            {/* Step 5: Order Delivered */}
            <View style={[trackingStyles.timelineItem, { marginBottom: 0 }]}>
              <View style={trackingStyles.timelineLeftCol}>
                <View style={trackingStyles.dotGraySolid} />
              </View>
              <View style={trackingStyles.timelineRightCol}>
                <Text style={trackingStyles.stepTitleMedium}>Order Delivered</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const trackingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // HEADER BAR
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerBackBtn: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  headerBackArrow: {
    fontSize: 24,
    color: '#1E293B',
    fontWeight: '700',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  headerSupportText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3500',
  },

  // MAP CANVAS
  mapCanvasContainer: {
    height: 320,
    backgroundColor: '#E8ECE3',
    position: 'relative',
    overflow: 'hidden',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E6ECE0',
    position: 'relative',
  },
  greenParkRegion: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '65%',
    height: '100%',
    backgroundColor: '#DCEDC8',
    opacity: 0.7,
  },
  hillContourA: {
    position: 'absolute',
    top: '10%',
    right: '15%',
    width: 140,
    height: 90,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: '#C5E1A5',
  },
  hillContourB: {
    position: 'absolute',
    top: '45%',
    right: '8%',
    width: 120,
    height: 80,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#C5E1A5',
  },

  // HIGHWAYS & BADGES
  highwayLineOrange: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '12%',
    width: 20,
    backgroundColor: '#F5A623',
    opacity: 0.85,
  },
  highwayBadge: {
    backgroundColor: '#3E50B4',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  highwayBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  roadLabel: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  pinContainer: {
    position: 'absolute',
  },

  // ROUTE LINES
  routeSegmentA: {
    position: 'absolute',
    top: '28%',
    left: '23%',
    width: 75,
    height: 3,
    backgroundColor: '#FF3500',
  },
  routeSegmentB: {
    position: 'absolute',
    top: '28%',
    left: '42%',
    width: 3,
    height: 48,
    backgroundColor: '#FF3500',
  },
  routeSegmentC: {
    position: 'absolute',
    top: '42%',
    left: '42%',
    width: 78,
    height: 3,
    backgroundColor: '#FF3500',
  },

  // CURRENT LOCATION & CALLOUT
  currentLocationDot: {
    position: 'absolute',
    top: '26%',
    left: '40%',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF3500',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  darkCalloutBadge: {
    position: 'absolute',
    top: '12%',
    left: '30%',
    backgroundColor: '#262626',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calloutTitleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  calloutSubtitleText: {
    color: '#A3A3A3',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  calloutArrowDown: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#262626',
  },

  // TARGET RING
  targetRingContainer: {
    position: 'absolute',
    top: '38%',
    right: '25%',
    alignItems: 'center',
  },
  targetRingOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#FF3500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetRingInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3500',
  },
  targetRingStem: {
    width: 2,
    height: 12,
    backgroundColor: '#FF3500',
  },

  // BOTTOM SHEET
  bottomSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    paddingHorizontal: 24,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
    flex: 1,
  },
  sheetHandleRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetHandleBar: {
    width: 52,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#D1D5DB',
  },

  // METRICS ROW
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricLabelText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValueText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 24,
  },

  // TIMELINE STEPPER
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeftCol: {
    width: 32,
    alignItems: 'center',
    position: 'relative',
  },
  timelineRightCol: {
    flex: 1,
    paddingLeft: 8,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stepTitleBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  stepTitleMedium: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 2,
  },
  stepTimeText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  stepSubtitleText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
    lineHeight: 18,
  },

  // TIMELINE DOTS & LINES
  dotRedSolid: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3500',
  },
  lineRedVertical: {
    position: 'absolute',
    top: 24,
    bottom: -24,
    width: 2,
    backgroundColor: '#FF3500',
  },
  dotRedRingContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FF3500',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  dotRedRingInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3500',
  },
  lineGrayVertical: {
    position: 'absolute',
    top: 26,
    bottom: -24,
    width: 2,
    backgroundColor: '#E5E7EB',
  },
  dotGraySolid: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1D5DB',
  },
});
