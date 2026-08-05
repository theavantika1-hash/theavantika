import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface TransactionItem {
  id: string;
  title: string;
  date: string;
  amount: string;
  status: 'Successful' | 'Pending' | 'Failed';
}

export const MOCK_TRANSACTIONS_PAGE1: TransactionItem[] = [
  { id: '1', title: 'Razor Pay', date: '19 January, 2019', amount: '$125', status: 'Successful' },
  { id: '2', title: 'Payout Deduction', date: '20 January, 2019', amount: '$1215', status: 'Successful' },
  { id: '3', title: 'Razor Pay', date: '19 January, 2019', amount: '$125', status: 'Successful' },
  { id: '4', title: 'Payout Deduction', date: '20 January, 2019', amount: '$1215', status: 'Successful' },
  { id: '5', title: 'Razor Pay', date: '19 January, 2019', amount: '$125', status: 'Successful' },
  { id: '6', title: 'Payout Deduction', date: '20 January, 2019', amount: '$1215', status: 'Successful' },
  { id: '7', title: 'Razor Pay', date: '19 January, 2019', amount: '$125', status: 'Successful' },
  { id: '8', title: 'Payout Deduction', date: '20 January, 2019', amount: '$1215', status: 'Successful' },
];

export const MOCK_TRANSACTIONS_PAGE2: TransactionItem[] = [
  { id: '9', title: 'Razor Pay', date: '15 January, 2019', amount: '$250', status: 'Successful' },
  { id: '10', title: 'Payout Deduction', date: '16 January, 2019', amount: '$850', status: 'Successful' },
  { id: '11', title: 'Razor Pay', date: '17 January, 2019', amount: '$100', status: 'Successful' },
  { id: '12', title: 'Payout Deduction', date: '18 January, 2019', amount: '$420', status: 'Successful' },
];

interface TransactionsScreenProps {
  onBack: () => void;
  onNavigateToNotifications?: () => void;
}

export function TransactionsScreen({
  onBack,
  onNavigateToNotifications,
}: TransactionsScreenProps) {
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const currentList = currentPage === 1 ? MOCK_TRANSACTIONS_PAGE1 : MOCK_TRANSACTIONS_PAGE2;

  const handleCardPress = (item: TransactionItem) => {
    Alert.alert(item.title, `Amount: ${item.amount}\nDate: ${item.date}\nStatus: ${item.status}`);
  };

  return (
    <View style={transStyles.container}>
      {/* 1. TOP CURVED TEAL HEADER (#4CA687) */}
      <View style={[transStyles.topHeader, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={transStyles.headerTopRow}>
          <View style={transStyles.brandRow}>
            <TouchableOpacity style={transStyles.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
              <Text style={transStyles.headerBackArrow}>←</Text>
            </TouchableOpacity>
            <View style={transStyles.utensilCircle}>
              <Text style={{ fontSize: 16 }}>🍴</Text>
            </View>
            <Text style={transStyles.brandTitle}>Food Love</Text>
          </View>

          <TouchableOpacity
            style={transStyles.bellTouch}
            onPress={() => {
              if (onNavigateToNotifications) onNavigateToNotifications();
            }}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 20 }}>🔔</Text>
            <View style={transStyles.bellBadge}>
              <Text style={transStyles.bellBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={transStyles.headerTitleRow}>
          <Text style={transStyles.headerTitleText}>Transactions</Text>
        </View>
      </View>

      {/* 2. TRANSACTIONS LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          transStyles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 24, 36) },
        ]}
      >
        <View style={transStyles.listContainer}>
          {currentList.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={transStyles.transCard}
              onPress={() => handleCardPress(item)}
              activeOpacity={0.75}
            >
              <View style={transStyles.cardTextCol}>
                <Text style={transStyles.cardTitleText}>{item.title}</Text>
                <Text style={transStyles.cardDateText}>{item.date}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                  <Text style={transStyles.cardAmountText}>{item.amount}</Text>
                  <Text style={transStyles.cardStatusGreen}>{item.status}</Text>
                </View>
                <Text style={transStyles.chevronRight}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. PAGINATION CONTROLS */}
        <View style={transStyles.paginationRow}>
          <TouchableOpacity
            style={[transStyles.pageBtn, currentPage === 1 && transStyles.pageBtnDisabled]}
            disabled={currentPage === 1}
            onPress={() => setCurrentPage(1)}
            activeOpacity={0.7}
          >
            <Text style={[transStyles.pageBtnText, currentPage === 1 && transStyles.pageBtnTextDisabled]}>
              «Prev
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[transStyles.pageBtn, currentPage === 2 && transStyles.pageBtnDisabled]}
            disabled={currentPage === 2}
            onPress={() => setCurrentPage(2)}
            activeOpacity={0.7}
          >
            <Text style={[transStyles.pageBtnText, currentPage === 2 && transStyles.pageBtnTextDisabled]}>
              Next »
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const transStyles = StyleSheet.create({
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
  bellTouch: {
    position: 'relative',
    padding: 6,
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF3500',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
    paddingTop: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  transCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  },
  cardTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D3F76',
    marginBottom: 4,
  },
  cardDateText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  cardAmountText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2D3F76',
  },
  cardStatusGreen: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4CA687',
    marginTop: 2,
  },
  chevronRight: {
    fontSize: 22,
    color: '#64748B',
    fontWeight: '400',
    marginLeft: 6,
  },

  // PAGINATION CONTROLS
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 12,
  },
  pageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D3F76',
  },
  pageBtnTextDisabled: {
    color: '#CBD5E1',
  },
});
