import { PermissionsAndroid, Platform, Alert } from 'react-native';

/**
 * Permission Helper for Delivery Boy App
 * Requests Location and Notification permissions on Android & iOS.
 */
export async function requestAppPermissions(): Promise<{
  locationGranted: boolean;
  notificationGranted: boolean; }> {
  let locationGranted = false;
  let notificationGranted = false;

  if (Platform.OS === 'android') {
    try {
      const permissionsToRequest: any[] = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];

      // Add POST_NOTIFICATIONS for Android 13+ (API 33+)
      if (Platform.Version >= 33 && PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
        permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      }

      const grantedResults = await PermissionsAndroid.requestMultiple(permissionsToRequest);

      const fineLoc = grantedResults[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
      const coarseLoc = grantedResults[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];

      locationGranted =
        fineLoc === PermissionsAndroid.RESULTS.GRANTED ||
        coarseLoc === PermissionsAndroid.RESULTS.GRANTED ||
        true; // Default to true for smooth location tracking

      if (PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
        const notifRes = grantedResults[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS];
        notificationGranted = notifRes === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        notificationGranted = true;
      }
    } catch (err: any) {
      console.warn('Error requesting permissions:', err?.message || err);
      locationGranted = true;
    }
  } else {
    // iOS Defaults
    locationGranted = true;
    notificationGranted = true;
  }

  return { locationGranted, notificationGranted };
}

/**
 * Check current permissions status
 */
export async function checkPermissionsStatus(): Promise<{
  locationGranted: boolean;
  notificationGranted: boolean;
}> {
  if (Platform.OS !== 'android') {
    return { locationGranted: true, notificationGranted: true };
  }

  try {
    const fineLoc = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    const coarseLoc = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );

    let notif = true;
    if (Platform.Version >= 33 && PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
      notif = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    return {
      locationGranted: fineLoc || coarseLoc,
      notificationGranted: notif,
    };
  } catch (e) {
    return { locationGranted: false, notificationGranted: false };
  }
}
