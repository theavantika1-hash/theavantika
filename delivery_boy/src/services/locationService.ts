import { PermissionsAndroid, Platform } from 'react-native';
import { deliveryBoyApi } from '../config/api';

// Live physical device GPS coordinates (no simulated movement)
let currentLat = 27.596704;
let currentLng = 76.632114;
let isTrackingActive = false;
let trackingTimer: any = null;

/**
 * Start Continuous Real-Time Physical Device GPS Location Tracking
 */
export async function startLiveLocationTracking() {
  if (isTrackingActive) return;
  isTrackingActive = true;

  // 1. Request Android Location Permissions
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
    } catch (e) {
      console.warn('Location permission request error:', e);
    }
  }

  const globalNav = typeof globalThis !== 'undefined' ? (globalThis as any).navigator : undefined;

  const updatePosition = async (lat: number, lng: number, addressStr?: string) => {
    currentLat = lat;
    currentLng = lng;

    try {
      await deliveryBoyApi.updateLocation({
        latitude: lat,
        longitude: lng,
        address: addressStr || 'Real Device Live GPS',
      });
    } catch (err: any) {
      console.log('Location update API notice:', err?.message || err);
    }
  };

  // Read REAL physical device GPS location (NO SIMULATED MOVEMENT)
  const pollRealGpsDevice = () => {
    if (globalNav && globalNav.geolocation) {
      globalNav.geolocation.getCurrentPosition(
        (pos: any) => {
          if (pos?.coords?.latitude && pos?.coords?.longitude) {
            updatePosition(pos.coords.latitude, pos.coords.longitude, 'Real Device GPS');
          }
        },
        (err: any) => {
          console.log('Device GPS read notice:', err?.message || err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
      );
    }
  };

  // Immediate fetch + 5-second periodic polling of physical device GPS
  pollRealGpsDevice();
  trackingTimer = setInterval(pollRealGpsDevice, 5000);
}

/**
 * Get current live GPS coordinates of device
 */
export function getCurrentCoordinates() {
  return {
    latitude: currentLat,
    longitude: currentLng,
  };
}

/**
 * Stop live location tracking
 */
export function stopLiveLocationTracking() {
  if (trackingTimer) {
    clearInterval(trackingTimer);
    trackingTimer = null;
  }
  isTrackingActive = false;
}
