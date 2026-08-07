import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { notificationService, AppNotification } from '../utils/notificationService';

interface NotificationsScreenProps {
  onBack: () => void;
  onSelectNotification?: (item: AppNotification) => void;
}

export function NotificationsScreen({
  onBack,
  onSelectNotification,
}: NotificationsScreenProps) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<AppNotification[]>(
    notificationService.getNotifications(),
  );
  const [activeFilter, setActiveFilter] = useState<'all' | 'order' | 'system'>('all');

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((updated) => {
      setNotifications(updated);
    });
    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'order') return n.type === 'order';
    if (activeFilter === 'system') return n.type === 'system' || n.type === 'rating' || n.type === 'payment';
    return true;
  });

  const handleCardPress = (item: AppNotification) => {
    notificationService.markAsRead(item.id);
    if (onSelectNotification) {
      onSelectNotification(item);
    } else {
      Alert.alert(
        item.title,
        `${item.message}\n\nTime: ${item.timestamp}${item.orderId ? `\nOrder ID: ${item.orderId}` : ''}`,
      );
    }
  };

  const handleTestNotification = () => {
    notificationService.addNotification(
      'New Instant Assignment! 🛵',
      'Order #AV-1829 assigned. Customer expects delivery in 25 mins.',
      'order',
      'AV-1829',
    );
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

          {/* Test Trigger Pill */}
          <TouchableOpacity
            style={notifStyles.testPill}
            onPress={handleTestNotification}
            activeOpacity={0.8}
          >
            <Text style={notifStyles.testPillText}>+ Test Alert</Text>
          </TouchableOpacity>
        </View>

        <View style={notifStyles.headerTitleRow}>
          <Text style={notifStyles.headerTitleText}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={notifStyles.unreadBadge}>
              <Text style={notifStyles.unreadBadgeText}>{unreadCount} New</Text>
            </View>
          )}
        </View>

        {/* Filter Pills & Actions */}
        <View style={notifStyles.filterRow}>
          <View style={notifStyles.pillsContainer}>
            <TouchableOpacity
              style={[notifStyles.filterPill, activeFilter === 'all' && notifStyles.filterPillActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[notifStyles.filterPillText, activeFilter === 'all' && notifStyles.filterPillTextActive]}>
                All ({notifications.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[notifStyles.filterPill, activeFilter === 'order' && notifStyles.filterPillActive]}
              onPress={() => setActiveFilter('order')}
            >
              <Text style={[notifStyles.filterPillText, activeFilter === 'order' && notifStyles.filterPillTextActive]}>
                Orders
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[notifStyles.filterPill, activeFilter === 'system' && notifStyles.filterPillActive]}
              onPress={() => setActiveFilter('system')}
            >
              <Text style={[notifStyles.filterPillText, activeFilter === 'system' && notifStyles.filterPillTextActive]}>
                System
              </Text>
            </TouchableOpacity>
          </View>

          {notifications.length > 0 && (
            <TouchableOpacity onPress={() => notificationService.markAllAsRead()}>
              <Text style={notifStyles.readAllText}>Mark Read</Text>
            </TouchableOpacity>
          )}
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
        {filteredNotifs.length === 0 ? (
          <View style={notifStyles.emptyBox}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🔔</Text>
            <Text style={notifStyles.emptyTitle}>No Notifications Found</Text>
            <Text style={notifStyles.emptySub}>You are all caught up!</Text>
          </View>
        ) : (
          filteredNotifs.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                notifStyles.notifCard,
                !item.isRead && notifStyles.unreadCard,
              ]}
              onPress={() => handleCardPress(item)}
              activeOpacity={0.75}
            >
              <View style={notifStyles.cardIconCol}>
                <View
                  style={[
                    notifStyles.iconBg,
                    item.type === 'order' ? { backgroundColor: '#E0F2FE' } : { backgroundColor: '#FEF3C7' },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>
                    {item.type === 'order' ? '🛵' : item.type === 'rating' ? '⭐' : item.type === 'payment' ? '💰' : '📢'}
                  </Text>
                </View>
              </View>

              <View style={notifStyles.cardTextCol}>
                <View style={notifStyles.titleRow}>
                  <Text style={notifStyles.orderNoText}>{item.title}</Text>
                  {!item.isRead && <View style={notifStyles.dotUnread} />}
                </View>
                <Text style={notifStyles.messageText}>{item.message}</Text>
                <Text style={notifStyles.timestampText}>{item.timestamp}</Text>
              </View>

              <Text style={notifStyles.chevronRight}>›</Text>
            </TouchableOpacity>
          ))
        )}
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
    paddingBottom: 20,
    elevation: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  },
  testPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  testPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  headerTitleText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  unreadBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  unreadBadgeText: {
    color: '#854D0E',
    fontSize: 11,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  filterPillActive: {
    backgroundColor: '#FFFFFF',
  },
  filterPillText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#4CA687',
    fontWeight: '800',
  },
  readAllText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 14,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3F76',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#94A3B8',
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  unreadCard: {
    borderColor: '#4CA687',
    backgroundColor: '#F4FAF8',
  },
  cardIconCol: {
    marginRight: 12,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  orderNoText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D3F76',
  },
  dotUnread: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CA687',
  },
  messageText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
    lineHeight: 18,
  },
  timestampText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4CA687',
  },
  chevronRight: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: '400',
  },
});
