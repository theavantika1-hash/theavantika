import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/appStyles';

export function NotVerifiedScreen({
  onUploadAgain,
}: {
  onUploadAgain: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, styles.statusScreenContainer]}>
      {/* Decorative Red Sparkles */}
      <View style={styles.confettiContainer}>
        <Text style={[styles.floatingSymbolRed, { top: 60, left: 50 }]}>✦</Text>
        <Text style={[styles.floatingSymbolRed, { top: 90, right: 60 }]}>✨</Text>
        <Text style={[styles.floatingSymbolRed, { top: 170, left: 35 }]}>✦</Text>
        <Text style={[styles.floatingSymbolRed, { top: 220, right: 45 }]}>✨</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.statusScrollContent,
          { paddingTop: Math.max(insets.top + 40, 60), paddingBottom: Math.max(insets.bottom + 24, 40) },
        ]}
        bounces={false}
      >
        {/* Large Red Circle Badge with Bold White Cross */}
        <View style={styles.notVerifiedBadgeOuter}>
          <View style={styles.notVerifiedBadgeInner}>
            <Text style={styles.notVerifiedCrossIcon}>✕</Text>
          </View>
        </View>

        {/* Decorative Wavy Title: Not-Verified */}
        <View style={styles.titleWavyRow}>
          <Text style={styles.wavyDecorationText}>〰️</Text>
          <Text style={styles.statusTitleRed}>Not-Verified</Text>
          <Text style={styles.wavyDecorationText}>〰️</Text>
        </View>

        {/* Subtitle Description */}
        <Text style={styles.statusDescriptionText}>
          Your 1 or more documents are not approved by Super Admin.{'\n'}Please upload the documents again.
        </Text>

        {/* Primary CTA Button: Upload Again */}
        <View style={styles.statusButtonsContainer}>
          <TouchableOpacity
            style={styles.redSubmitPillButton}
            onPress={onUploadAgain}
            activeOpacity={0.85}
          >
            <Text style={styles.redSubmitButtonText}>Upload Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
