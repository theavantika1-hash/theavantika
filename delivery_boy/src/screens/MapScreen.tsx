import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/appStyles';
import { deliveryBoyApi } from '../config/api';
import { OrderMapView } from '../components/OrderMapView';

const { width } = Dimensions.get('window');

interface MapScreenProps {
  onBack: () => void;
  locationText?: string;
  activeOrdersCount?: number;
  totalDistanceKm?: number;
}

export function MapScreen({
  onBack,
  locationText = '#321, Phase-II, UE, Ludhiana, India...',
  activeOrdersCount = 4,
  totalDistanceKm = 12.5,
}: MapScreenProps) {
  const insets = useSafeAreaInsets();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCenterLocation = () => {
    const globalNav = typeof globalThis !== 'undefined' ? (globalThis as any).navigator : undefined;
    if (globalNav && globalNav.geolocation) {
      globalNav.geolocation.getCurrentPosition(
        async (pos: any) => {
          try {
            await deliveryBoyApi.updateLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              address: locationText
            });
            Alert.alert('GPS Location Updated', `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} streamed to backend.`);
          } catch (e) {
            Alert.alert('Centered Location', 'Map view centered on your current location.');
          }
        },
        () => Alert.alert('Centered Location', 'Map view centered on your current location.')
      );
    } else {
      Alert.alert('Centered Location', 'Map view centered on your current location.');
    }
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <View style={styles.mapScreenContainer}>
      {/* TOP HEADER BAR */}
      {!isFullscreen && (
        <View style={[styles.mapHeaderBar, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity
            style={styles.mapHeaderBackTouch}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.mapHeaderBackArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.mapHeaderTitle}>Map</Text>
        </View>
      )}

      {/* DYNAMIC MAP VIEW */}
      <View style={styles.mapViewContainer}>
        <OrderMapView
          restaurantName="Avantika Restaurant"
          restaurantAddress="SH 25, Bhagwanpura, Alwar"
          deliveryAddress={locationText}
          totalDistance={`${totalDistanceKm} km`}
          timeRemaining="20 mins"
          orderStatus={`${activeOrdersCount} Active Orders`}
          onCenterLocation={handleCenterLocation}
        />

        {/* FLOATING ACTION BUTTON: EXPAND MAP */}
        <TouchableOpacity
          style={styles.mapExpandBtn}
          onPress={handleToggleFullscreen}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 18, color: '#1E293B' }}>
            {isFullscreen ? '↙' : '⤢'}
          </Text>
        </TouchableOpacity>

        {/* FLOATING ACTION BUTTON: TARGET LOCATION */}
        <TouchableOpacity
          style={styles.mapLocationTargetBtn}
          onPress={handleCenterLocation}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 20 }}>🎯</Text>
        </TouchableOpacity>

        {/* BOTTOM OVERLAY LOCATION & STATS CARD */}
        <View style={styles.mapFloatingCard}>
          {/* Location Header Row */}
          <View style={styles.mapLocationHeaderRow}>
            <View style={styles.mapLocationRedPinBox}>
              <Text style={styles.mapLocationRedPinIcon}>📍</Text>
            </View>

            <View style={styles.mapLocationTextCol}>
              <Text style={styles.mapLocationTitleRed}>Location</Text>
              <Text style={styles.mapLocationSubtitle} numberOfLines={1}>
                {locationText}
              </Text>
            </View>
          </View>

          {/* Yellow Stats Container Box */}
          <View style={styles.mapStatsYellowBox}>
            {/* Active Orders Column */}
            <View style={styles.mapStatCol}>
              <View style={styles.mapStatValRow}>
                <Text style={styles.mapStatValueText}>{activeOrdersCount}</Text>
              </View>
              <Text style={styles.mapStatLabelText}>Active Orders</Text>
            </View>

            {/* Vertical Divider Line */}
            <View style={styles.mapStatDividerLine} />

            {/* Total Distance Column */}
            <View style={styles.mapStatCol}>
              <View style={styles.mapStatValRow}>
                <Text style={styles.mapStatValueText}>{totalDistanceKm}</Text>
                <Text style={styles.mapStatKmUnit}>km</Text>
              </View>
              <Text style={styles.mapStatLabelText}>Total Distance</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// CANVAS DRAWING STYLES FOR THE STYLIZED MAP
export const mapCanvasStyles = StyleSheet.create({
  mapCanvas: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FAF5EF',
  },
  waterBody: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '24%',
    backgroundColor: '#7DD3FC',
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  waterLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
    letterSpacing: 1.2,
    opacity: 0.7,
  },
  gatePark: {
    position: 'absolute',
    top: '40%',
    left: '-5%',
    width: '32%',
    height: '6%',
    backgroundColor: '#86EFAC',
    borderRadius: 8,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  glenPark: {
    position: 'absolute',
    top: '67%',
    left: '35%',
    width: '38%',
    height: '8%',
    backgroundColor: '#86EFAC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parkLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  highway101: {
    position: 'absolute',
    top: '24%',
    right: '18%',
    width: 14,
    bottom: 0,
    backgroundColor: '#FDBA74',
    transform: [{ rotate: '-18deg' }],
  },
  highway280: {
    position: 'absolute',
    bottom: '5%',
    left: '20%',
    width: width * 1.2,
    height: 12,
    backgroundColor: '#FDBA74',
    transform: [{ rotate: '-28deg' }],
  },
  roadGridHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  roadGridVertical: {
    position: 'absolute',
    top: '24%',
    bottom: 0,
    width: 2,
    backgroundColor: '#E2E8F0',
  },
  cityNameHeader: {
    position: 'absolute',
    top: '31%',
    right: '2%',
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
  },
  districtText: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 0.5,
  },
  districtTextBold: {
    position: 'absolute',
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.3,
  },
  shieldBadge: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  shieldBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  // ROUTE LINES
  routeLinePathA: {
    position: 'absolute',
    top: '40%',
    left: '33%',
    width: 65,
    height: 3,
    backgroundColor: '#EF4444',
    transform: [{ rotate: '15deg' }],
  },
  routeLinePathB: {
    position: 'absolute',
    top: '44%',
    left: '35%',
    width: 90,
    height: 3,
    backgroundColor: '#EF4444',
    transform: [{ rotate: '40deg' }],
  },
  routeLinePathC: {
    position: 'absolute',
    top: '46%',
    left: '50%',
    width: 85,
    height: 3,
    backgroundColor: '#EF4444',
    transform: [{ rotate: '30deg' }],
  },
  routeLinePathD: {
    position: 'absolute',
    top: '52%',
    right: '25%',
    width: 45,
    height: 3,
    backgroundColor: '#EF4444',
    transform: [{ rotate: '60deg' }],
  },
  // PINS
  pinContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinRingOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: '#EF4444',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  pinStem: {
    width: 2,
    height: 8,
    backgroundColor: '#EF4444',
  },
  activeLocationRedCircle: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  numberedMarkerCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberedMarkerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
});
