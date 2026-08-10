import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  PanResponder,
  Dimensions,
} from 'react-native';
import { GOOGLE_MAPS_API_KEY as DEFAULT_KEY } from '../config/mapsConfig';
import { deliveryBoyApi } from '../config/api';
import { requestAppPermissions, checkPermissionsStatus } from '../utils/permissionHelper';

const { width, height } = Dimensions.get('window');

interface OrderMapViewProps {
  orderNumber?: string;
  customerName?: string;
  restaurantName?: string;
  restaurantAddress?: string;
  deliveryAddress?: string;
  riderName?: string;
  totalDistance?: string;
  timeRemaining?: string;
  riderLat?: number;
  riderLng?: number;
  restaurantLat?: number;
  restaurantLng?: number;
  customerLat?: number;
  customerLng?: number;
  orderStatus?: string;
  onCenterLocation?: () => void;
  hideOverlayCard?: boolean;
  style?: any;
}

export function OrderMapView({
  orderNumber = 'Order #123456789',
  customerName = 'John Doe',
  restaurantName = 'Avantika Restaurant',
  restaurantAddress = 'SH 25, near Telco circle, Bhagwanpura, Alwar',
  deliveryAddress = '153, Shalimar Nagar Colony Rd, Alwar, Rajasthan',
  riderName = 'Delivery Executive (You)',
  totalDistance = '3.5 km',
  timeRemaining = '18 mins',
  restaurantLat = 27.596704286992576,
  restaurantLng = 76.63211439999625,
  customerLat = 27.6208,
  customerLng = 76.6436,
  riderLat: initialRiderLat = 27.6085,
  riderLng: initialRiderLng = 76.6385,
  orderStatus = 'Out for Delivery',
  onCenterLocation,
  hideOverlayCard = false,
  style,
}: OrderMapViewProps) {
  // Config & State
  const [apiKey, setApiKey] = React.useState<string>(DEFAULT_KEY);
  const [showKeyModal, setShowKeyModal] = React.useState<boolean>(false);
  const [tempKeyInput, setTempKeyInput] = React.useState<string>(DEFAULT_KEY);
  const [zoomLevel, setZoomLevel] = React.useState<number>(14);
  const [mapType, setMapType] = React.useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // GPS Location & Permission State
  const [currentRiderLat, setCurrentRiderLat] = React.useState<number>(initialRiderLat);
  const [currentRiderLng, setCurrentRiderLng] = React.useState<number>(initialRiderLng);
  const [isGpsActive, setIsGpsActive] = React.useState<boolean>(false);
  const [showGpsPromptModal, setShowGpsPromptModal] = React.useState<boolean>(false);
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);

  // Drag / Pan Offset State for Movable Map
  const [panOffsetLat, setPanOffsetLat] = React.useState<number>(0);
  const [panOffsetLng, setPanOffsetLng] = React.useState<number>(0);
  const [isMapDragged, setIsMapDragged] = React.useState<boolean>(false);

  // Check & Request GPS Permission on Mount and sync live coordinates
  React.useEffect(() => {
    let intervalId: any = null;

    const initGpsPermissions = async () => {
      const status = await checkPermissionsStatus();
      if (!status.locationGranted) {
        setShowGpsPromptModal(true);
      } else {
        startGpsTracking();
      }
    };
    initGpsPermissions();

    import('../services/locationService').then(({ startLiveLocationTracking, getCurrentCoordinates }) => {
      startLiveLocationTracking();
      setIsGpsActive(true);

      intervalId = setInterval(() => {
        const coords = getCurrentCoordinates();
        if (coords.latitude && coords.longitude) {
          setCurrentRiderLat(coords.latitude);
          setCurrentRiderLng(coords.longitude);
        }
      }, 3000);
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Function to Start Live Real-Time GPS Location Tracking & Streaming
  const startGpsTracking = async () => {
    import('../services/locationService').then(({ startLiveLocationTracking }) => {
      startLiveLocationTracking();
      setIsGpsActive(true);
    });
  };

  // Handle GPS Permission Request Button
  const handleAllowGpsPress = async () => {
    setShowGpsPromptModal(false);
    setIsGpsActive(true);
    startGpsTracking();
    try {
      await requestAppPermissions();
    } catch (e) {}
    Alert.alert('GPS Location Active', 'Real-time live location tracking active for order delivery.');
  };

  // Drag / Touch PanResponder for Movable Map View
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Convert screen pixel drag offset (dx, dy) to Lat/Lng shifts
        const zoomScale = Math.pow(2, 20 - zoomLevel);
        const latShift = (gestureState.dy / 100000) * (zoomScale / 50);
        const lngShift = (-gestureState.dx / 100000) * (zoomScale / 50);

        setPanOffsetLat(prev => prev + latShift);
        setPanOffsetLng(prev => prev + lngShift);
        setIsMapDragged(true);
      },
    })
  ).current;

  const [encodedPolyline, setEncodedPolyline] = useState<string>('');

  // Fetch Road-Following Encoded Polyline from Google Directions API
  useEffect(() => {
    let isMounted = true;
    const fetchRoadDirections = async () => {
      if (!apiKey) return;
      try {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${currentRiderLat},${currentRiderLng}&destination=${customerLat},${customerLng}&waypoints=${restaurantLat},${restaurantLng}&key=${apiKey.trim()}`;
        const res = await fetch(url);
        const data = await res.json();
        if (isMounted && data.status === 'OK' && data.routes?.[0]?.overview_polyline?.points) {
          setEncodedPolyline(data.routes[0].overview_polyline.points);
        }
      } catch (e) {
        console.log('Directions API notice:', e);
      }
    };
    fetchRoadDirections();
    return () => { isMounted = false; };
  }, [currentRiderLat, currentRiderLng, restaurantLat, restaurantLng, customerLat, customerLng, apiKey]);

  // Base Center Map Coordinates
  const baseCenterLat = (restaurantLat + customerLat + currentRiderLat) / 3;
  const baseCenterLng = (restaurantLng + customerLng + currentRiderLng) / 3;

  // Effective Center Coordinates with User Drag/Pan Offset
  const effectiveCenterLat = baseCenterLat + panOffsetLat;
  const effectiveCenterLng = baseCenterLng + panOffsetLng;

  // Calculate Screen Position Projections for Real GPS Coordinates
  const latSpan = 0.05 / Math.pow(2, zoomLevel - 14);
  const lngSpan = 0.05 / Math.pow(2, zoomLevel - 14);

  const getScreenPos = (lat: number, lng: number) => {
    const xPct = Math.round(50 + ((lng - effectiveCenterLng) / lngSpan) * 100);
    const yPct = Math.round(50 - ((lat - effectiveCenterLat) / latSpan) * 100);
    const clampedX = Math.max(10, Math.min(85, xPct));
    const clampedY = Math.max(12, Math.min(85, yPct));
    return {
      left: `${clampedX}%` as any,
      top: `${clampedY}%` as any,
    };
  };

  const riderPos = getScreenPos(currentRiderLat, currentRiderLng);
  const restPos = getScreenPos(restaurantLat, restaurantLng);
  const custPos = getScreenPos(customerLat, customerLng);

  // Construct Road Polyline vs Straight Fallback Path
  const pathParam = encodedPolyline
    ? `path=color:0xf97316ff%7Cweight:6%7Cenc:${encodeURIComponent(encodedPolyline)}`
    : `path=color:0xf97316ff%7Cweight:6%7C${currentRiderLat.toFixed(5)},${currentRiderLng.toFixed(5)}%7C${restaurantLat.toFixed(5)},${restaurantLng.toFixed(5)}%7C${customerLat.toFixed(5)},${customerLng.toFixed(5)}`;

  // Google Maps Static API Map Image URL with Swiggy orange route path following real roads
  const googleMapStaticUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${effectiveCenterLat.toFixed(5)},${effectiveCenterLng.toFixed(5)}&zoom=${zoomLevel}&size=640x640&scale=2&maptype=${mapType}&markers=color:orange%7Clabel:D%7C${currentRiderLat.toFixed(5)},${currentRiderLng.toFixed(5)}&markers=color:red%7Clabel:R%7C${restaurantLat.toFixed(5)},${restaurantLng.toFixed(5)}&markers=color:green%7Clabel:C%7C${customerLat.toFixed(5)},${customerLng.toFixed(5)}&${pathParam}&key=${apiKey.trim()}`;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 10));

  const handleToggleMapType = () => {
    setMapType(prev => (prev === 'roadmap' ? 'satellite' : prev === 'satellite' ? 'hybrid' : 'roadmap'));
  };

  const handleRecenterLocation = () => {
    setPanOffsetLat(0);
    setPanOffsetLng(0);
    setIsMapDragged(false);
    setZoomLevel(14);
    if (onCenterLocation) onCenterLocation();
    Alert.alert('Map Recentered', 'Map view recentered to delivery route.');
  };

  const handleSaveApiKey = () => {
    if (tempKeyInput.trim()) {
      setApiKey(tempKeyInput.trim());
      setShowKeyModal(false);
      setImageLoading(true);
      Alert.alert('Google API Key Applied', 'Map reloaded with new Google API Key.');
    } else {
      Alert.alert('Error', 'Please enter a valid Google Maps API key.');
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* MOVABLE / PANABLE MAP CANVAS */}
      <View style={styles.mapFrame} {...panResponder.panHandlers}>
        <Image
          source={{ uri: googleMapStaticUrl }}
          style={styles.googleMapImage}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          resizeMode="cover"
        />

        {imageLoading && (
          <View style={styles.mapLoadingOverlay}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Fetching Google Map...</Text>
          </View>
        )}

        {/* DRAG / PAN INSTRUCTION BADGE */}
        {isMapDragged && (
          <View style={styles.draggedBadge}>
            <Text style={styles.draggedBadgeText}>🖐️ Map Moved (Touch Recenter 🎯 to Reset)</Text>
          </View>
        )}

        {/* DYNAMIC MAP OVERLAY PINS BASED ON REAL GPS COORDINATES */}
        {/* Restaurant Marker Pin */}
        <View style={[styles.overlayPinWrapper, restPos, { marginTop: -24 }]}>
          <View style={styles.pinTagBadge}>
            <Text style={styles.pinTagText} numberOfLines={1}>
              🏪 {restaurantName}
            </Text>
          </View>
        </View>

        {/* Customer Marker Pin */}
        <View style={[styles.overlayPinWrapper, custPos, { marginTop: -24 }]}>
          <View style={[styles.pinTagBadge, { backgroundColor: '#10b981' }]}>
            <Text style={[styles.pinTagText, { color: '#ffffff' }]} numberOfLines={1}>
              🏠 Customer ({customerName})
            </Text>
          </View>
        </View>

        {/* PROMINENT PULSING LIVE DELIVERY BOY GPS LOCATION POINT */}
        <View style={[styles.overlayPinWrapper, riderPos]}>
          <View style={styles.riderLocationBeacon}>
            {/* Outer Pulsing Blue Radar Ring */}
            <View style={styles.riderPulseAura} />
            {/* Inner Solid Glowing Point */}
            <View style={styles.riderDotCenter} />
            {/* Rider Name & Status Tag */}
            <View style={styles.riderBadgePill}>
              <Text style={styles.riderBadgePillText} numberOfLines={1}>
                🛵 {riderName} {isGpsActive ? '🟢 Live GPS' : ''}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* TOP CONTROLS BAR */}
      <View style={styles.topHeaderBar}>
        <View style={styles.topBadge}>
          <View style={[styles.greenDot, { backgroundColor: isGpsActive ? '#22c55e' : '#f59e0b' }]} />
          <Text style={styles.topBadgeText}>
            Google Maps ({mapType.toUpperCase()})
          </Text>
        </View>

        <TouchableOpacity
          style={styles.keyBtn}
          onPress={() => setShowKeyModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.keyBtnText}>🔑 API Key</Text>
        </TouchableOpacity>
      </View>

      {/* RIGHT SIDE ZOOM & MAP TYPE CONTROLS */}
      <View style={styles.rightControlsStack}>
        <TouchableOpacity
          style={styles.controlIconBtn}
          onPress={handleToggleMapType}
          activeOpacity={0.8}
        >
          <Text style={styles.controlIconText}>
            {mapType === 'roadmap' ? '🗺️' : '🛰️'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlIconBtn}
          onPress={handleZoomIn}
          activeOpacity={0.8}
        >
          <Text style={styles.controlIconText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlIconBtn}
          onPress={handleZoomOut}
          activeOpacity={0.8}
        >
          <Text style={styles.controlIconText}>−</Text>
        </TouchableOpacity>
      </View>

      {/* RECENTER GPS BUTTON */}
      <TouchableOpacity
        style={styles.centerTargetBtn}
        onPress={handleRecenterLocation}
        activeOpacity={0.85}
      >
        <Text style={styles.centerTargetIcon}>🎯</Text>
      </TouchableOpacity>

      {/* DETAILED ORDER ADDRESSES OVERLAY CARD ON MAP VIEW */}
      {!hideOverlayCard && (
        <View style={styles.orderAddressCardOnMap}>
          <View style={styles.addressItemRow}>
            <Text style={{ fontSize: 13, marginRight: 6 }}>🏪</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabelTitle}>RESTAURANT</Text>
              <Text style={styles.addressDetailText} numberOfLines={1}>
                {restaurantName} • {restaurantAddress}
              </Text>
            </View>
          </View>

          <View style={styles.addressDivider} />

          <View style={styles.addressItemRow}>
            <Text style={{ fontSize: 13, marginRight: 6 }}>🏠</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabelTitle}>DELIVERY ADDRESS ({customerName})</Text>
              <Text style={styles.addressDetailText} numberOfLines={1}>
                {deliveryAddress}
              </Text>
            </View>
          </View>

          {/* METRICS & STATUS BADGE */}
          <View style={styles.cardFooterMetricsRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.etaTextValue}>
                📍 {totalDistance} (Est. {timeRemaining})
              </Text>
            </View>

            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusPillText}>{orderStatus}</Text>
            </View>
          </View>
        </View>
      )}

      {/* GPS PERMISSION PROMPT MODAL */}
      <Modal
        visible={showGpsPromptModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGpsPromptModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.gpsPromptCard}>
            <View style={styles.gpsIconCircle}>
              <Text style={{ fontSize: 28 }}>🛰️</Text>
            </View>

            <Text style={styles.gpsModalTitle}>Allow Live GPS Location Access</Text>
            <Text style={styles.gpsModalDesc}>
              Enable device location permissions so we can track real-time delivery routes, calculate accurate ETA for customers, and stream live rider coordinates to the backend database.
            </Text>

            <View style={styles.gpsModalBtnCol}>
              <TouchableOpacity
                style={styles.allowGpsBtn}
                onPress={handleAllowGpsPress}
                activeOpacity={0.85}
              >
                <Text style={styles.allowGpsBtnText}>Allow GPS Location Access</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notNowBtn}
                onPress={() => setShowGpsPromptModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.notNowBtnText}>Not Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* GOOGLE MAPS API KEY CONFIGURATION MODAL */}
      <Modal
        visible={showKeyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowKeyModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>🔑 Google Maps API Key</Text>
            <Text style={styles.modalDesc}>
              Paste your Google Maps API key below to render Google Maps imagery:
            </Text>

            <TextInput
              style={styles.keyInput}
              value={tempKeyInput}
              onChangeText={setTempKeyInput}
              placeholder="Paste Google Maps API Key (AIzaSy...)"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowKeyModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveApiKey}
              >
                <Text style={styles.saveBtnText}>Save Key</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#0f172a',
  },
  mapFrame: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#1e293b',
  },
  googleMapImage: {
    width: '100%',
    height: '100%',
  },
  mapLoadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  draggedBadge: {
    position: 'absolute',
    top: 48,
    alignSelf: 'center',
    backgroundColor: 'rgba(234, 179, 8, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    zIndex: 6,
  },
  draggedBadgeText: {
    color: '#713f12',
    fontSize: 10,
    fontWeight: '800',
  },
  overlayPinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  riderLocationBeacon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderPulseAura: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    borderWidth: 1.5,
    borderColor: '#3b82f6',
  },
  riderDotCenter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563eb',
    borderWidth: 2.5,
    borderColor: '#ffffff',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 6,
  },
  riderBadgePill: {
    marginTop: 4,
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  riderBadgePillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  pinTagBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    maxWidth: 160,
  },
  pinTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0f172a',
  },
  topHeaderBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  topBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  topBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  keyBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  keyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1e293b',
  },
  rightControlsStack: {
    position: 'absolute',
    top: 54,
    right: 12,
    gap: 6,
    zIndex: 10,
  },
  controlIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  controlIconText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  centerTargetBtn: {
    position: 'absolute',
    bottom: 110,
    right: 14,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  centerTargetIcon: {
    fontSize: 20,
  },
  orderAddressCardOnMap: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  addressItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLabelTitle: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  addressDetailText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 1,
  },
  addressDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 6,
  },
  cardFooterMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  etaTextValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563eb',
  },
  statusPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803d',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gpsPromptCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },
  gpsIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gpsModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  gpsModalDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  gpsModalBtnCol: {
    width: '100%',
    gap: 10,
  },
  allowGpsBtn: {
    width: '100%',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  allowGpsBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  notNowBtn: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  notNowBtnText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  modalDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 14,
  },
  keyInput: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    color: '#0f172a',
    marginBottom: 16,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#2563eb',
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
});
