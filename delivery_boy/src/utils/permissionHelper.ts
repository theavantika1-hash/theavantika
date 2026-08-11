import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Permission Helper for Delivery Boy App
 * Requests Location and Notification permissions on Android & iOS.
 */
export async function requestAppPermissions(): Promise<{
  locationGranted: boolean;
  notificationGranted: boolean;
}> {
  console.log('[LOCATION] screen opened');
  console.log('[LOCATION] checking permission');

  let locationGranted = false;
  let notificationGranted = false;

  if (Platform.OS === 'android') {
    try {
      const fineCheck = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      const coarseCheck = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

      if (fineCheck || coarseCheck) {
        console.log('[LOCATION] permission already granted');
        locationGranted = true;
      } else {
        console.log('[LOCATION] requesting permission');
        const permissionsToRequest: any[] = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ];

        if (Platform.Version >= 33 && PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
          permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        }

        const grantedResults = await PermissionsAndroid.requestMultiple(permissionsToRequest);
        console.log('[LOCATION] permission result =', grantedResults);

        const fineLoc = grantedResults[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
        const coarseLoc = grantedResults[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];

        locationGranted =
          fineLoc === PermissionsAndroid.RESULTS.GRANTED ||
          coarseLoc === PermissionsAndroid.RESULTS.GRANTED;

        if (locationGranted) {
          console.log('[LOCATION] permission granted');
        } else {
          console.warn('[LOCATION] permission denied');
        }
      }

      if (Platform.Version >= 33 && PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
        const notifCheck = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        notificationGranted = notifCheck;
      } else {
        notificationGranted = true;
      }
    } catch (err: any) {
      console.warn('[LOCATION] Error requesting permissions:', err?.message || err);
      locationGranted = false;
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
