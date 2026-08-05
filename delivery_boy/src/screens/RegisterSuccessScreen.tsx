import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/appStyles';

export function RegisterSuccessScreen({
  onNextState,
  onDone,
}: {
  onNextState: () => void;
  onDone: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, styles.statusScreenContainer]}>
      {/* Confetti Background Decorative Dots */}
      <View style={styles.confettiContainer}>
        <View style={[styles.confettiDot, { top: 40, left: 30, backgroundColor: '#FF3B00' }]} />
        <View style={[styles.confettiDot, { top: 70, right: 45, backgroundColor: '#FACC15' }]} />
        <View style={[styles.confettiDot, { top: 120, left: 70, backgroundColor: '#38BDF8' }]} />
        <View style={[styles.confettiDot, { top: 160, right: 80, backgroundColor: '#14B8A6' }]} />
        <View style={[styles.confettiRect, { top: 90, left: 160, backgroundColor: '#EC4899', transform: [{ rotate: '45deg' }] }]} />
        <View style={[styles.confettiRect, { top: 200, left: 40, backgroundColor: '#F97316', transform: [{ rotate: '15deg' }] }]} />
        <View style={[styles.confettiRect, { top: 220, right: 50, backgroundColor: '#8B5CF6', transform: [{ rotate: '-30deg' }] }]} />
        <View style={[styles.confettiDot, { top: 280, left: 90, backgroundColor: '#10B981' }]} />
        <View style={[styles.confettiDot, { top: 310, right: 100, backgroundColor: '#FF3B00' }]} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.statusScrollContent,
          { paddingTop: Math.max(insets.top + 40, 60), paddingBottom: Math.max(insets.bottom + 24, 40) },
        ]}
        bounces={false}
      >
        {/* Large Teal Circle Badge with White Checkmark */}
        <View style={styles.successCircleBadgeOuter}>
          <View style={styles.successCircleBadgeInner}>
            <Text style={styles.successCheckmarkIcon}>✓</Text>
          </View>
        </View>

        {/* Decorative Wavy Title: Thank you */}
        <View style={styles.titleWavyRow}>
          <Text style={styles.wavyDecorationText}>〰️</Text>
          <Text style={styles.statusTitleRed}>Thank you</Text>
          <Text style={styles.wavyDecorationText}>〰️</Text>
        </View>

        {/* Subtitle Description */}
        <Text style={styles.statusDescriptionText}>
          Your details have been sent to Super Admin,{'\n'}Once Approved, We'd notify you via email.
        </Text>

        {/* State Toggle & Done Buttons at Bottom */}
        <View style={styles.statusButtonsContainer}>
          <TouchableOpacity
            style={styles.redSubmitPillButton}
            onPress={onNextState}
            activeOpacity={0.85}
          >
            <Text style={styles.redSubmitButtonText}>View "Under Progress" Status →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryTextBtn}
            onPress={onDone}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryTextBtnLabel}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
