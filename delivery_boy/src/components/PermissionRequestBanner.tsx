import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { requestAppPermissions, checkPermissionsStatus } from '../utils/permissionHelper';

interface PermissionRequestBannerProps {
  onPermissionsGranted?: () => void;
}

export function PermissionRequestBanner({ onPermissionsGranted }: PermissionRequestBannerProps) {
  const [hasPermissions, setHasPermissions] = useState<boolean>(true);

  const verifyPermissions = async () => {
    const status = await checkPermissionsStatus();
    const isGranted = status.locationGranted && status.notificationGranted;
    setHasPermissions(isGranted);
    if (isGranted && onPermissionsGranted) {
      onPermissionsGranted();
    }
  };

  useEffect(() => {
    verifyPermissions();
  }, []);

  const handleGrantPress = async () => {
    const result = await requestAppPermissions();
    if (result.locationGranted) {
      setHasPermissions(true);
      if (onPermissionsGranted) onPermissionsGranted();
    } else {
      verifyPermissions();
    }
  };

  if (hasPermissions) return null;

  return (
    <View style={bannerStyles.container}>
      <View style={bannerStyles.iconCol}>
        <Text style={{ fontSize: 20 }}>📍</Text>
      </View>
      <View style={bannerStyles.textCol}>
        <Text style={bannerStyles.titleText}>Location & Notification Permissions Required</Text>
        <Text style={bannerStyles.descText}>
          Allow permissions so we can track live GPS delivery routes and alert you on new orders.
        </Text>
      </View>
      <TouchableOpacity style={bannerStyles.allowBtn} onPress={handleGrantPress} activeOpacity={0.8}>
        <Text style={bannerStyles.allowBtnText}>Allow</Text>
      </TouchableOpacity>
    </View>
  );
}

const bannerStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCol: {
    marginRight: 10,
  },
  textCol: {
    flex: 1,
    paddingRight: 8,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#78350F',
    marginBottom: 2,
  },
  descText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 15,
  },
  allowBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  allowBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
