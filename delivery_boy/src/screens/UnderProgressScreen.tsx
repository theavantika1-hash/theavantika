import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/appStyles';
import { deliveryBoyApi } from '../config/api';

export function UnderProgressScreen({
  userEmail,
  onApproved,
  onNextState,
  onBack,
}: {
  userEmail?: string;
  onApproved?: () => void;
  onNextState: () => void;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!userEmail) return;

    const checkStatus = async () => {
      try {
        const res = await deliveryBoyApi.getApprovalStatus(userEmail);
        if (res.data?.approvalStatus === 'approved') {
          if (onApproved) onApproved();
        }
      } catch (err) {
        // Polling silent catch
      }
    };


    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [userEmail, onApproved]);

  return (
    <View style={[styles.container, styles.statusScreenContainer]}>
      {/* Floating Currency & Sparkle Decorative Icons */}
      <View style={styles.confettiContainer}>
        <Text style={[styles.floatingSymbol, { top: 60, left: 40 }]}>£</Text>
        <Text style={[styles.floatingSymbol, { top: 90, right: 50 }]}>$</Text>
        <Text style={[styles.floatingSymbol, { top: 180, left: 30 }]}>✦</Text>
        <Text style={[styles.floatingSymbol, { top: 220, right: 40 }]}>✨</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.statusScrollContent,
          { paddingTop: Math.max(insets.top + 30, 50), paddingBottom: Math.max(insets.bottom + 24, 40) },
        ]}
        bounces={false}
      >
        {/* Delivery Scooter Illustration */}
        <View style={styles.underProgressIllustrationBox}>
          <Image
            source={require('../assets/delivery_boy_scooter.png')}
            style={styles.underProgressScooterImg}
            resizeMode="contain"
          />
        </View>

        {/* Decorative Wavy Title: Approval Pending */}
        <View style={styles.titleWavyRow}>
          <Text style={styles.wavyDecorationText}>⏳</Text>
          <Text style={styles.statusTitleRed}>Approval Pending</Text>
          <Text style={styles.wavyDecorationText}>⏳</Text>
        </View>

        {/* Subtitle Description */}
        <Text style={styles.statusDescriptionText}>
          Your approval status is currently <Text style={{ fontWeight: '800', color: '#DC2626' }}>PENDING</Text>.{'\n'}
          Your documents and profile are being evaluated by Super Admin.{'\n'}
          You cannot access the dashboard until your profile is approved.
        </Text>

        {/* Live Checking Status Badge */}
        <View style={{
          backgroundColor: '#FEF3C7',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 20,
          borderWidth: 1.5,
          borderColor: '#F59E0B',
          marginVertical: 14,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#B45309' }}>
            🔒 Approval Pending · Checking Live Admin Status...
          </Text>
        </View>


        {/* Action Buttons */}
        <View style={styles.statusButtonsContainer}>
          <TouchableOpacity
            style={styles.redSubmitPillButton}
            onPress={onNextState}
            activeOpacity={0.85}
          >
            <Text style={styles.redSubmitButtonText}>View "Not-Verified" Status →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryTextBtn}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryTextBtnLabel}>← Back to Thank You</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

