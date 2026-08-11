import { Platform } from 'react-native';
import { requestAppPermissions } from '../utils/permissionHelper';
import { emitDeliveryLocation, LocationPayload } from './socketService';
import { getHaversineDistanceMeters } from './routingService';
import { deliveryBoyApi } from '../config/api';

export type GpsStatusType = 'INITIALIZING' | 'PERMISSION_DENIED' | 'SEARCHING' | 'LIVE' | 'STALE' | 'OFFLINE';

export interface LocationFix {
  latitude: number | null;
  longitude: number | null;
  accuracy: number;
  heading: number;
  speed: number;
  timestamp: number;
  isLive: boolean;
  hasRealGpsFix: boolean;
  gpsStatus: GpsStatusType;
}

let lastValidFix: LocationFix = {
  latitude: null,
  longitude: null,
  accuracy: 0,
  heading: 0,
  speed: 0,
  timestamp: 0,
  isLive: false,
  hasRealGpsFix: false,
  gpsStatus: 'INITIALIZING',
};

let activeOrderId: string | null = null;
let activeDeliveryBoyId: string | null = null;
let isTrackingActive = false;
let gpsWatchId: number | null = null;
let pollTimer: any = null;

const locationFixListeners: Array<(fix: LocationFix) => void> = [];

/**
 * Configure active Order ID and Delivery Boy ID for streaming
 */
export function setTrackingContext(orderId?: string | null, deliveryBoyId?: string | null) {
  if (orderId !== undefined) activeOrderId = orderId;
  if (deliveryBoyId !== undefined) activeDeliveryBoyId = deliveryBoyId;
}

/**
 * Validate incoming GPS fix according to Quality Control rules (PART 2)
 */
export function validateGpsFix(rawFix: Partial<LocationFix>): LocationFix | null {
  const { latitude, longitude, accuracy = 0, heading = 0, speed = 0, timestamp = Date.now() } = rawFix;

  if (latitude === null || longitude === null || latitude === undefined || longitude === undefined) {
    return null;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  // 1. Latitude and Longitude range check
  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    console.warn('[GPS QC] Rejected out-of-bounds coordinates:', lat, lng);
    return null;
  }

  // 2. Reject zero coordinates
  if (lat === 0 && lng === 0) {
    console.warn('[GPS QC] Rejected zero coordinates (0, 0)');
    return null;
  }

  // 3. Extremely inaccurate GPS readings (> 500 meters threshold for initial emulator fix)
  if (accuracy > 500) {
    console.warn(`[GPS QC] Rejected low accuracy fix: ${accuracy}m > 500m`);
    return null;
  }

  // 4. Stale timestamp filter (> 60 seconds old)
  const now = Date.now();
  if (timestamp > 0 && now - timestamp > 60000) {
    console.warn('[GPS QC] Rejected stale timestamp fix');
    return null;
  }

  // 5. Impossible jump / speed outlier check (> 150 km/h or 41.6 m/s)
  if (lastValidFix.hasRealGpsFix && lastValidFix.latitude !== null && lastValidFix.longitude !== null && lastValidFix.timestamp > 0) {
    const timeDiffSec = (timestamp - lastValidFix.timestamp) / 1000;
    if (timeDiffSec > 0.2) {
      const distMeters = getHaversineDistanceMeters(
        lastValidFix.latitude,
        lastValidFix.longitude,
        lat,
        lng
      );
      const calculatedSpeedMs = distMeters / timeDiffSec;

      if (calculatedSpeedMs > 42 && distMeters > 200) {
        console.warn(
          `[GPS QC] Rejected impossible GPS jump: ${Math.round(distMeters)}m in ${timeDiffSec.toFixed(1)}s (${Math.round(calculatedSpeedMs * 3.6)} km/h)`
        );
        return null;
      }
    }
  }

  console.log(`[GPS CALLBACK] lat: ${lat} lng: ${lng} accuracy: ${accuracy}m heading: ${heading} speed: ${speed}`);

  const validFix: LocationFix = {
    latitude: lat,
    longitude: lng,
    accuracy: Number(accuracy) || 5,
    heading: Number(heading) || lastValidFix.heading || 0,
    speed: Number(speed) || 0,
    timestamp: timestamp || Date.now(),
    isLive: true,
    hasRealGpsFix: true,
    gpsStatus: 'LIVE',
  };

  return validFix;
}

/**
 * Handle a new validated GPS fix
 */
function handleNewLocationFix(rawFix: Partial<LocationFix>) {
  const validFix = validateGpsFix(rawFix);
  if (!validFix || validFix.latitude === null || validFix.longitude === null) return;

  lastValidFix = validFix;

  // Stream fix to Socket.IO backend (PART 3 & PART 4)
  const payload: LocationPayload = {
    orderId: activeOrderId || undefined,
    deliveryBoyId: activeDeliveryBoyId || undefined,
    latitude: validFix.latitude,
    longitude: validFix.longitude,
    accuracy: validFix.accuracy,
    heading: validFix.heading,
    speed: validFix.speed,
    timestamp: validFix.timestamp,
  };

  emitDeliveryLocation(payload);

  // Notify active listeners
  locationFixListeners.forEach(cb => cb(validFix));

  // Sync to HTTP backend fallback
  try {
    deliveryBoyApi.updateLocation({
      id: activeDeliveryBoyId || undefined,
      latitude: validFix.latitude,
      longitude: validFix.longitude,
      address: 'Real Device GPS',
    }).catch(() => {});
  } catch (e) {}
}

/**
 * Start Continuous Real-Time Device GPS Location Tracking after Runtime Permission
 */
export async function startLiveLocationTracking(orderId?: string, deliveryBoyId?: string) {
  setTrackingContext(orderId, deliveryBoyId);
  if (isTrackingActive) return;
  isTrackingActive = true;

  console.log('[LOCATION] screen opened');

  // 1. Request Runtime Permission
  const permRes = await requestAppPermissions();
  if (!permRes.locationGranted) {
    console.warn('[LOCATION] permission denied');
    lastValidFix.gpsStatus = 'PERMISSION_DENIED';
    locationFixListeners.forEach(cb => cb({ ...lastValidFix }));
    isTrackingActive = false;
    return;
  }

  lastValidFix.gpsStatus = 'SEARCHING';
  locationFixListeners.forEach(cb => cb({ ...lastValidFix }));

  const globalNav = typeof globalThis !== 'undefined' ? (globalThis as any).navigator : undefined;

  if (globalNav && globalNav.geolocation) {
    const fetchCurrentPos = (highAccuracy: boolean) => {
      globalNav.geolocation.getCurrentPosition(
        (pos: any) => {
          console.log(`[GPS SUCCESS] highAccuracy:${highAccuracy}`, pos?.coords);
          if (pos?.coords) {
            handleNewLocationFix({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy || 10,
              heading: pos.coords.heading || 0,
              speed: pos.coords.speed || 0,
              timestamp: pos.timestamp || Date.now(),
            });
          }
        },
        (err: any) => {
          console.warn(`[GPS NOTICE] highAccuracy:${highAccuracy}`, err?.message || err);
          if (highAccuracy) {
            // Fallback to network/cell provider if satellite high accuracy is pending
            fetchCurrentPos(false);
          }
        },
        { enableHighAccuracy: highAccuracy, timeout: 8000, maximumAge: 10000 }
      );
    };

    // Immediate dual fetch (High Accuracy + Network Provider Fallback)
    fetchCurrentPos(true);
    fetchCurrentPos(false);

    // Continuous watchPosition
    try {
      gpsWatchId = globalNav.geolocation.watchPosition(
        (pos: any) => {
          if (pos?.coords) {
            handleNewLocationFix({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              heading: pos.coords.heading,
              speed: pos.coords.speed,
              timestamp: pos.timestamp || Date.now(),
            });
          }
        },
        (err: any) => {
          console.warn('[GPS WATCH NOTICE]', err?.message || err);
        },
        {
          enableHighAccuracy: false, // Network/Fused provider is fastest on Android
          timeout: 10000,
          maximumAge: 5000,
          distanceFilter: 1,
        }
      );
    } catch (e) {
      console.warn('[GPS] Watcher registration error:', e);
    }

    // Periodic 2-second polling to ensure continuous fixes on emulator/device
    pollTimer = setInterval(() => {
      fetchCurrentPos(false);
    }, 2000);
  }
}

/**
 * Get latest validated GPS fix
 */
export function getCurrentCoordinates(): LocationFix {
  return { ...lastValidFix };
}

/**
 * Subscribe to validated location fixes
 */
export function subscribeLocationFixes(callback: (fix: LocationFix) => void) {
  locationFixListeners.push(callback);
  callback(lastValidFix);
  return () => {
    const idx = locationFixListeners.indexOf(callback);
    if (idx !== -1) locationFixListeners.splice(idx, 1);
  };
}

/**
 * Stop continuous location tracking
 */
export function stopLiveLocationTracking() {
  const globalNav = typeof globalThis !== 'undefined' ? (globalThis as any).navigator : undefined;

  if (gpsWatchId !== null && globalNav && globalNav.geolocation) {
    try {
      globalNav.geolocation.clearWatch(gpsWatchId);
    } catch (e) {}
    gpsWatchId = null;
  }

  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }

  isTrackingActive = false;
}
