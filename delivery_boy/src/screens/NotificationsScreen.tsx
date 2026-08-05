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

export interface NotificationItem {
  id: string;
  orderNo: string;
  message: string;
  timestamp: string;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    orderNo: 'Order #442123456',
    message: 'Pickup Ready by Restaurant',
    timestamp: '29th July, 2021 - 04:32 pm',
  },
  {
    id: '2',
    orderNo: 'Order #442123449',
    message: '5 star rating received from user.',
    timestamp: '29th July, 2021 - 04:00 pm',
  },
  {
    id: '3',
    orderNo: 'Order #442123454',
    message: 'Order Delivered. Ask for rating.',
    timestamp: '29th July, 2021 - 03:32 pm',
  },
];

interface NotificationsScreenProps {
  onBack: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
}

export function NotificationsScreen({
  onBack,
  onSelectNotification,
}: NotificationsScreenProps) {
  const insets = useSafeAreaInsets();

  const handleCardPress = (item: NotificationItem) => {
    if (onSelectNotification) {
      onSelectNotification(item);
    } else {
      Alert.alert(item.orderNo, `${item.message}\nTimestamp: ${item.timestamp}`);
    }
  };

  return (
    <View style={notifStyles.container}>
      {/* 1. TOP CURVED TEAL HEADER (#4CA687) */}
      <View style={[notifStyles.topHeader, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={notifStyles.headerTopRow}>
          <View style={notifStyles.brandRow}>
            <TouchableOpacity style={notifStyles.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
              <Text style={notifStyles.headerBackArrow}>←</Text>
            </TouchableOpacity>
            <View style={notifStyles.utensilCircle}>
              <Text style={{ fontSize: 16 }}>🍴</Text>
            </View>
            <Text style={notifStyles.brandTitle}>Food Love</Text>
          </View>
        </View>

        <View style={notifStyles.headerTitleRow}>
          <Text style={notifStyles.headerTitleText}>Notifications Area</Text>
        </View>
      </View>

      {/* 2. NOTIFICATIONS LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          notifStyles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 20, 30) },
        ]}
      >
        {MOCK_NOTIFICATIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={notifStyles.notifCard}
            onPress={() => handleCardPress(item)}
            activeOpacity={0.75}
          >
            <View style={notifStyles.cardTextCol}>
              <Text style={notifStyles.orderNoText}>{item.orderNo}</Text>
              <Text style={notifStyles.messageText}>{item.message}</Text>
              <Text style={notifStyles.timestampText}>{item.timestamp}</Text>
            </View>

            <Text style={notifStyles.chevronRight}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const notifStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topHeader: {
    backgroundColor: '#4CA687',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBackBtn: {
    marginRight: 8,
    paddingVertical: 2,
  },
  headerBackArrow: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  utensilCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  orderNoText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3F76',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
    marginBottom: 8,
    lineHeight: 20,
  },
  timestampText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CA687',
  },
  chevronRight: {
    fontSize: 22,
    color: '#64748B',
    fontWeight: '400',
  },
});
