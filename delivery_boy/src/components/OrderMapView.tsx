import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import WebView from 'react-native-webview';
import { requestAppPermissions, checkPermissionsStatus } from '../utils/permissionHelper';
import {
  startLiveLocationTracking,
  subscribeLocationFixes,
  LocationFix,
  GpsStatusType,
} from '../services/locationService';
import {
  joinOrderRoom,
  leaveOrderRoom,
  subscribeLocationUpdates,
  subscribeConnectionStatus,
} from '../services/socketService';
import {
  fetchRoadRoute,
  snapGpsToRoadPolyline,
  segmentRoute,
  RoutePoint,
} from '../services/routingService';

interface OrderMapViewProps {
  orderNumber?: string;
  customerName?: string;
  restaurantName?: string;
  restaurantAddress?: string;
  deliveryAddress?: string;
  riderName?: string;
  totalDistance?: string;
  timeRemaining?: string;
  restaurantLat?: number;
  restaurantLng?: number;
  customerLat?: number;
  customerLng?: number;
  orderStatus?: string;
  orderId?: string;
  deliveryBoyId?: string;
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
  restaurantLat = 27.596704,
  restaurantLng = 76.632114,
  customerLat = 27.6208,
  customerLng = 76.6436,
  orderStatus = 'Out for Delivery',
  orderId = '123456789',
  deliveryBoyId,
  onCenterLocation,
  hideOverlayCard = false,
  style,
}: OrderMapViewProps) {
  const webViewRef = useRef<any>(null);

  // Real GPS Fix State - NO FAKE / HARDCODED INITIAL COORDINATES
  const [riderFix, setRiderFix] = useState<LocationFix>({
    latitude: null,
    longitude: null,
    accuracy: 0,
    heading: 0,
    speed: 0,
    timestamp: 0,
    isLive: false,
    hasRealGpsFix: false,
    gpsStatus: 'INITIALIZING',
  });

  const [locationPermGranted, setLocationPermGranted] = useState<boolean>(false);
  const [snappedLat, setSnappedLat] = useState<number | null>(null);
  const [snappedLng, setSnappedLng] = useState<number | null>(null);
  const [isFollowMode, setIsFollowMode] = useState<boolean>(true);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [showGpsPromptModal, setShowGpsPromptModal] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  const [fullRoutePoints, setFullRoutePoints] = useState<RoutePoint[]>([]);
  const [remainingRoutePoints, setRemainingRoutePoints] = useState<RoutePoint[]>([]);
  const [traveledRoutePoints, setTraveledRoutePoints] = useState<RoutePoint[]>([]);
  const [roadDistanceKm, setRoadDistanceKm] = useState<string>(totalDistance);
  const [roadEtaMins, setRoadEtaMins] = useState<string>(timeRemaining);
  const [isOffRoute, setIsOffRoute] = useState<boolean>(false);

  // 1. Initial Permission Check & Runtime GPS Request
  useEffect(() => {
    let unmounted = false;

    const initGpsAndSockets = async () => {
      console.log('[LOCATION] screen opened');
      console.log('[LOCATION] checking permission');

      const status = await checkPermissionsStatus();
      if (!status.locationGranted) {
        setShowGpsPromptModal(true);
      } else {
        setLocationPermGranted(true);
      }

      await startLiveLocationTracking(orderId, deliveryBoyId);
    };

    initGpsAndSockets();

    if (orderId) {
      joinOrderRoom(orderId, 'delivery_boy');
    }

    const unsubSocket = subscribeConnectionStatus(connected => {
      if (!unmounted) setSocketConnected(connected);
    });

    const unsubGps = subscribeLocationFixes(fix => {
      if (!unmounted && fix) {
        setRiderFix(fix);
        if (fix.gpsStatus !== 'PERMISSION_DENIED') {
          setLocationPermGranted(true);
        }
      }
    });

    const unsubSocketLoc = subscribeLocationUpdates(data => {
      if (!unmounted && data && data.latitude && data.longitude) {
        setRiderFix(prev => ({
          ...prev,
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy || prev.accuracy,
          heading: data.heading || prev.heading,
          speed: data.speed || prev.speed,
          timestamp: data.timestamp || Date.now(),
          isLive: true,
          hasRealGpsFix: true,
          gpsStatus: 'LIVE',
        }));
      }
    });

    return () => {
      unmounted = true;
      if (orderId) leaveOrderRoom(orderId);
      unsubSocket();
      unsubGps();
      unsubSocketLoc();
    };
  }, [orderId, deliveryBoyId]);

  // 2. Fetch Initial Road Network Route
  useEffect(() => {
    let active = true;
    const loadRoadRoute = async () => {
      const isBeforePickup =
        (orderStatus || '').toUpperCase().includes('ASSIGNED') ||
        (orderStatus || '').toUpperCase().includes('ACCEPTED') ||
        (orderStatus || '').toUpperCase().includes('RESTAURANT');

      const origin = riderFix.latitude !== null && riderFix.longitude !== null
        ? { latitude: riderFix.latitude, longitude: riderFix.longitude }
        : { latitude: restaurantLat, longitude: restaurantLng };

      const waypoints = isBeforePickup
        ? [origin, { latitude: restaurantLat, longitude: restaurantLng }]
        : [origin, { latitude: customerLat, longitude: customerLng }];

      const res = await fetchRoadRoute(waypoints, orderId);
      if (active && res.points.length > 0) {
        setFullRoutePoints(res.points);
        setRoadDistanceKm(`${res.distanceKm} km`);
        setRoadEtaMins(`${res.durationMins} mins`);
      }
    };

    loadRoadRoute();
    return () => {
      active = false;
    };
  }, [restaurantLat, restaurantLng, customerLat, customerLng, orderStatus, orderId, riderFix.latitude, riderFix.longitude]);

  // 3. Process GPS Snapping & Route Segmentation strictly when real GPS fix is available
  useEffect(() => {
    if (riderFix.latitude === null || riderFix.longitude === null || fullRoutePoints.length === 0) {
      return;
    }

    const snap = snapGpsToRoadPolyline(riderFix.latitude, riderFix.longitude, fullRoutePoints, 50);
    setSnappedLat(snap.snappedLat);
    setSnappedLng(snap.snappedLng);
    setIsOffRoute(snap.isOffRoute);

    const segmented = segmentRoute(snap.snappedLat, snap.snappedLng, fullRoutePoints);
    setTraveledRoutePoints(segmented.traveledRoute);
    setRemainingRoutePoints(segmented.remainingRoute);

    if (snap.isOffRoute) {
      const recalculateOffRoute = async () => {
        const isBeforePickup = (orderStatus || '').toUpperCase().includes('RESTAURANT');
        const target = isBeforePickup
          ? { latitude: restaurantLat, longitude: restaurantLng }
          : { latitude: customerLat, longitude: customerLng };

        const newRoute = await fetchRoadRoute([
          { latitude: riderFix.latitude!, longitude: riderFix.longitude! },
          target,
        ]);

        if (newRoute.points.length > 0) {
          setFullRoutePoints(newRoute.points);
          setRoadDistanceKm(`${newRoute.distanceKm} km`);
          setRoadEtaMins(`${newRoute.durationMins} mins`);
        }
      };
      recalculateOffRoute();
    }
  }, [riderFix.latitude, riderFix.longitude, fullRoutePoints, orderStatus, restaurantLat, restaurantLng, customerLat, customerLng]);

  // 4. Send Real-Time Updates to Leaflet Map inside WebView
  useEffect(() => {
    if (!isMapLoaded || !webViewRef.current) return;

    const script = `
      if (window.updateMapData) {
        window.updateMapData({
          hasRealGpsFix: ${riderFix.hasRealGpsFix},
          riderLat: ${snappedLat !== null ? snappedLat : riderFix.latitude !== null ? riderFix.latitude : 'null'},
          riderLng: ${snappedLng !== null ? snappedLng : riderFix.longitude !== null ? riderFix.longitude : 'null'},
          heading: ${riderFix.heading || 0},
          restaurantLat: ${restaurantLat},
          restaurantLng: ${restaurantLng},
          customerLat: ${customerLat},
          customerLng: ${customerLng},
          remainingRoute: ${JSON.stringify(remainingRoutePoints)},
          traveledRoute: ${JSON.stringify(traveledRoutePoints)},
          isFollowMode: ${isFollowMode}
        });
      }
    `;
    webViewRef.current.injectJavaScript(script);
  }, [riderFix.hasRealGpsFix, riderFix.latitude, riderFix.longitude, snappedLat, snappedLng, riderFix.heading, restaurantLat, restaurantLng, customerLat, customerLng, remainingRoutePoints, traveledRoutePoints, isFollowMode, isMapLoaded]);

  // Calculate GPS Status & Timestamp Diff (PART 10 & 11)
  const timeSinceUpdateSec = riderFix.timestamp > 0 ? Math.floor((Date.now() - riderFix.timestamp) / 1000) : 999;
  let activeGpsStatus: GpsStatusType = riderFix.gpsStatus;

  if (riderFix.gpsStatus === 'PERMISSION_DENIED') {
    activeGpsStatus = 'PERMISSION_DENIED';
  } else if (!riderFix.hasRealGpsFix) {
    activeGpsStatus = 'SEARCHING';
  } else if (timeSinceUpdateSec > 30) {
    activeGpsStatus = 'OFFLINE';
  } else if (timeSinceUpdateSec > 15) {
    activeGpsStatus = 'STALE';
  } else {
    activeGpsStatus = 'LIVE';
  }

  const handleRecenter = () => {
    setIsFollowMode(true);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (window.recenterRider) window.recenterRider();
      `);
    }
    if (onCenterLocation) onCenterLocation();
  };

  const handleAllowGps = async () => {
    setShowGpsPromptModal(false);
    const res = await requestAppPermissions();
    if (res.locationGranted) {
      setLocationPermGranted(true);
      startLiveLocationTracking(orderId, deliveryBoyId);
    }
  };

  // Base map center point
  const mapCenterLat = restaurantLat;
  const mapCenterLng = restaurantLng;

  // Leaflet JS Vector Map HTML Template
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map { width: 100%; height: 100%; margin: 0; padding: 0; background: #0f172a; }
        .leaflet-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        
        .rider-marker-icon {
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .rider-beacon {
          position: relative;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rider-aura {
          position: absolute;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.25);
          border: 2px solid #3b82f6;
          animation: pulse 2s infinite;
        }
        .rider-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2563eb;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
          z-index: 2;
        }
        
        .pin-card {
          background: #ffffff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
          color: #0f172a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          white-space: nowrap;
          border: 1px solid #e2e8f0;
        }
        .customer-pin-card {
          background: #10b981;
          color: #ffffff;
          border: none;
        }
        
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${mapCenterLat}, ${mapCenterLng}], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        var riderIcon = L.divIcon({
          className: 'rider-marker-icon',
          html: '<div class="rider-beacon"><div class="rider-aura"></div><div class="rider-dot">🛵</div></div>',
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });

        var restIcon = L.divIcon({
          className: 'custom-pin',
          html: '<div class="pin-card">🍴 ${restaurantName.replace(/'/g, "\\'")}</div>',
          iconAnchor: [30, 15]
        });

        var custIcon = L.divIcon({
          className: 'custom-pin',
          html: '<div class="pin-card customer-pin-card">🏠 ${customerName.replace(/'/g, "\\'")}</div>',
          iconAnchor: [30, 15]
        });

        var riderMarker = null; // ONLY CREATED WHEN REAL GPS FIX ARRIVES
        var restMarker = L.marker([${restaurantLat}, ${restaurantLng}], { icon: restIcon }).addTo(map);
        var custMarker = L.marker([${customerLat}, ${customerLng}], { icon: custIcon }).addTo(map);

        var remainingPolyline = L.polyline([], { color: '#f97316', weight: 6, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }).addTo(map);
        var traveledPolyline = L.polyline([], { color: '#94a3b8', weight: 5, opacity: 0.6, dashArray: '8, 8' }).addTo(map);

        var bounds = L.latLngBounds([
          [${restaurantLat}, ${restaurantLng}],
          [${customerLat}, ${customerLng}]
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });

        map.on('dragstart', function() {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'USER_DRAGGED_MAP' }));
          }
        });

        window.recenterRider = function() {
          if (riderMarker) {
            var pos = riderMarker.getLatLng();
            map.setView(pos, 16, { animate: true });
          } else {
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        };

        window.updateMapData = function(data) {
          if (!data) return;

          // Render Delivery Boy Marker ONLY when real physical GPS coordinates exist
          if (data.hasRealGpsFix && data.riderLat !== null && data.riderLng !== null) {
            var newLatLng = new L.LatLng(data.riderLat, data.riderLng);
            if (!riderMarker) {
              riderMarker = L.marker(newLatLng, { icon: riderIcon }).addTo(map);
            } else {
              riderMarker.setLatLng(newLatLng);
            }
            
            var el = riderMarker.getElement();
            if (el && data.heading !== undefined) {
              el.style.transform += ' rotate(' + data.heading + 'deg)';
            }

            if (data.isFollowMode) {
              map.panTo(newLatLng, { animate: true, duration: 0.5 });
            }
          }

          if (data.remainingRoute && data.remainingRoute.length > 0) {
            var remPoints = data.remainingRoute.map(function(p) { return [p.latitude, p.longitude]; });
            remainingPolyline.setLatLngs(remPoints);
          }

          if (data.traveledRoute && data.traveledRoute.length > 0) {
            var travPoints = data.traveledRoute.map(function(p) { return [p.latitude, p.longitude]; });
            traveledPolyline.setLatLngs(travPoints);
          }
        };
      </script>
    </body>
    </html>
  `;

  return (
    <View style={[styles.container, style]}>
      {/* INTERACTIVE LEAFLET WEBVIEW MAP */}
      <View style={styles.mapFrame}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: leafletHtml }}
          style={styles.webView}
          onLoadEnd={() => setIsMapLoaded(true)}
          onMessage={(event: any) => {
            try {
              const msg = JSON.parse(event.nativeEvent.data);
              if (msg.type === 'USER_DRAGGED_MAP') {
                setIsFollowMode(false);
              }
            } catch (e) {}
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />

        {!isMapLoaded && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading Interactive Map Engine...</Text>
          </View>
        )}
      </View>

      {/* REQUIRED DEVELOPMENT DEBUG BAR OVERLAY (PART 17) */}
      <View style={styles.debugPanel}>
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>Permission:</Text>
          <Text style={[styles.debugVal, { color: locationPermGranted ? '#22c55e' : '#ef4444' }]}>
            {locationPermGranted ? 'GRANTED' : 'DENIED'}
          </Text>
          <Text style={styles.debugLabel}> | GPS:</Text>
          <Text style={[styles.debugVal, { color: activeGpsStatus === 'LIVE' ? '#22c55e' : activeGpsStatus === 'SEARCHING' ? '#f59e0b' : '#ef4444' }]}>
            {activeGpsStatus}
          </Text>
          <Text style={styles.debugLabel}> | Socket:</Text>
          <Text style={[styles.debugVal, { color: socketConnected ? '#22c55e' : '#ef4444' }]}>
            {socketConnected ? 'CONNECTED' : 'OFFLINE'}
          </Text>
        </View>

        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>Lat:</Text>
          <Text style={styles.debugVal}>
            {riderFix.latitude !== null ? riderFix.latitude.toFixed(6) : 'Waiting for GPS...'}
          </Text>
          <Text style={styles.debugLabel}> | Lng:</Text>
          <Text style={styles.debugVal}>
            {riderFix.longitude !== null ? riderFix.longitude.toFixed(6) : 'Waiting for GPS...'}
          </Text>
          <Text style={styles.debugLabel}> | Acc:</Text>
          <Text style={styles.debugVal}>{riderFix.accuracy}m</Text>
        </View>

        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>Marker Source:</Text>
          <Text style={[styles.debugVal, { color: riderFix.hasRealGpsFix ? '#22c55e' : '#f59e0b' }]}>
            {riderFix.hasRealGpsFix ? 'REAL PHYSICAL DEVICE GPS' : 'NONE (Waiting for Physical GPS)'}
          </Text>
          <Text style={styles.debugLabel}> | Updated:</Text>
          <Text style={styles.debugVal}>{timeSinceUpdateSec < 900 ? `${timeSinceUpdateSec}s ago` : 'Never'}</Text>
        </View>
      </View>

      {/* RECENTER TARGET BUTTON */}
      <TouchableOpacity
        style={[styles.centerTargetBtn, isFollowMode && styles.centerTargetActive]}
        onPress={handleRecenter}
        activeOpacity={0.85}
      >
        <Text style={styles.centerTargetIcon}>🎯</Text>
      </TouchableOpacity>

      {/* OVERLAY ADDRESS & METRICS CARD */}
      {!hideOverlayCard && (
        <View style={styles.orderCardOnMap}>
          <View style={styles.addressRow}>
            <Text style={styles.addressIcon}>🍴</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressTitle}>RESTAURANT PICKUP</Text>
              <Text style={styles.addressSub} numberOfLines={1}>
                {restaurantName} • {restaurantAddress}
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.addressRow}>
            <Text style={styles.addressIcon}>🏠</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressTitle}>DELIVERY ADDRESS ({customerName})</Text>
              <Text style={styles.addressSub} numberOfLines={1}>
                {deliveryAddress}
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.metricText}>
              🛣️ Road: {roadDistanceKm} (Est. {roadEtaMins})
            </Text>

            <View style={styles.orderStatusPill}>
              <Text style={styles.orderStatusText}>{orderStatus}</Text>
            </View>
          </View>

          {!riderFix.hasRealGpsFix && (
            <View style={styles.waitingGpsBanner}>
              <ActivityIndicator size="small" color="#d97706" style={{ marginRight: 6 }} />
              <Text style={styles.waitingGpsText}>Waiting for Physical Device GPS fix...</Text>
            </View>
          )}

          {isOffRoute && riderFix.hasRealGpsFix && (
            <View style={styles.offRouteBanner}>
              <Text style={styles.offRouteText}>⚠️ Off Route Detected — Recalculating Road Path...</Text>
            </View>
          )}
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
          <View style={styles.gpsCard}>
            <Text style={styles.gpsTitle}>🛰️ Location Access Required</Text>
            <Text style={styles.gpsDesc}>
              Please grant location permission so the app can track your real physical GPS location for delivery navigation.
            </Text>
            <TouchableOpacity style={styles.allowBtn} onPress={handleAllowGps}>
              <Text style={styles.allowBtnText}>Grant Location Permission</Text>
            </TouchableOpacity>
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
    backgroundColor: '#0f172a',
  },
  webView: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  debugPanel: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
    zIndex: 30,
    gap: 2,
  },
  debugRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  debugLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  debugVal: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 3,
  },
  centerTargetBtn: {
    position: 'absolute',
    bottom: 120,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 20,
  },
  centerTargetActive: {
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  centerTargetIcon: {
    fontSize: 22,
  },
  orderCardOnMap: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressIcon: {
    fontSize: 14,
  },
  addressTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  addressSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  metricText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
  },
  orderStatusPill: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  waitingGpsBanner: {
    marginTop: 6,
    backgroundColor: '#fffbebfd',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fcd34d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingGpsText: {
    color: '#b45309',
    fontSize: 10,
    fontWeight: '800',
  },
  offRouteBanner: {
    marginTop: 6,
    backgroundColor: '#fef2f2',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  offRouteText: {
    color: '#dc2626',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  gpsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  gpsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  gpsDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  allowBtn: {
    backgroundColor: '#2563eb',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  allowBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
