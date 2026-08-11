import { PermissionsAndroid, Platform, Linking } from 'react-native';

export type PermissionStatusType = 'GRANTED' | 'DENIED' | 'NEVER_ASK_AGAIN' | 'UNAVAILABLE';

/**
 * Open Android App Settings
 */
export function openAppSettings() {
  if (Platform.OS === 'android') {
    Linking.openSettings().catch(() => {
      console.warn('[LOCATION] Could not open app settings');
    });
  }
}

/**
 * Permission Helper for Delivery Boy App
 * Requests Location and Notification permissions on Android & iOS.
 */
export async function requestAppPermissions(): Promise<{
  locationGranted: boolean;
  status: PermissionStatusType;
  notificationGranted: boolean;
}> {
  console.log('[LOCATION] screen opened');
  console.log('[LOCATION] Checking permission');

  let locationGranted = false;
  let status: PermissionStatusType = 'DENIED';
  let notificationGranted = false;

  if (Platform.OS === 'android') {
    try {
      const fineCheck = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      const coarseCheck = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

      console.log(`[LOCATION] Current permission = FINE:${fineCheck}, COARSE:${coarseCheck}`);

      if (fineCheck || coarseCheck) {
        console.log('[LOCATION] Permission granted');
        locationGranted = true;
        status = 'GRANTED';
      } else {
        console.log('[LOCATION] Requesting Android location permission');

        // Primary: Request FINE location directly with Android system rationale dialog
        const resFine = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'Delivery Boy App requires your precise GPS location to navigate delivery routes and update customers.',
            buttonPositive: 'Allow Location Access',
            buttonNegative: 'Cancel',
          }
        );

        console.log('[LOCATION] Permission result =', resFine);

        if (resFine === PermissionsAndroid.RESULTS.GRANTED) {
          locationGranted = true;
          status = 'GRANTED';
          console.log('[LOCATION] Permission granted');
        } else if (resFine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          status = 'NEVER_ASK_AGAIN';
          console.warn('[LOCATION] Permission permanently denied (NEVER_ASK_AGAIN)');
        } else {
          // Secondary fallback: Request COARSE location if fine was refused
          const resCoarse = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            {
              title: 'Approximate Location Required',
              message: 'Delivery Boy App needs approximate location for order routing.',
              buttonPositive: 'Allow',
            }
          );
          if (resCoarse === PermissionsAndroid.RESULTS.GRANTED) {
            locationGranted = true;
            status = 'GRANTED';
            console.log('[LOCATION] Permission granted (coarse)');
          } else {
            status = resCoarse === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ? 'NEVER_ASK_AGAIN' : 'DENIED';
            console.warn('[LOCATION] Permission denied');
          }
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
      status = 'DENIED';
    }
  } else {
    // iOS Defaults
    locationGranted = true;
    status = 'GRANTED';
    notificationGranted = true;
  }

  return { locationGranted, status, notificationGranted };
}

/**
 * Check current permissions status
 */
export async function checkPermissionsStatus(): Promise<{
  locationGranted: boolean;
  status: PermissionStatusType;
  notificationGranted: boolean;
}> {
  if (Platform.OS !== 'android') {
    return { locationGranted: true, status: 'GRANTED', notificationGranted: true };
  }

  try {
    const fineLoc = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    const coarseLoc = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );

    const isGranted = fineLoc || coarseLoc;
    const status: PermissionStatusType = isGranted ? 'GRANTED' : 'DENIED';

    let notif = true;
    if (Platform.Version >= 33 && PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
      notif = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    return {
      locationGranted: isGranted,
      status,
      notificationGranted: notif,
    };
  } catch (e) {
    return { locationGranted: false, status: 'DENIED', notificationGranted: false };
  }
}
