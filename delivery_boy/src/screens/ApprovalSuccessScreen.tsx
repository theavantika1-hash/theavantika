import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/appStyles';

export function ApprovalSuccessScreen({
  onNavigateToHome,
}: {
  onNavigateToHome: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) {
      onNavigateToHome();
    }
  }, [countdown, onNavigateToHome]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <View style={[styles.container, styles.statusScreenContainer, { backgroundColor: '#F0FDF4' }]}>
      {/* Decorative Floating Sparkles */}
      <View style={styles.confettiContainer}>
        <Text style={[styles.floatingSymbol, { top: 60, left: 40, color: '#10B981' }]}>✦</Text>
        <Text style={[styles.floatingSymbol, { top: 90, right: 50, color: '#059669' }]}>🎉</Text>
        <Text style={[styles.floatingSymbol, { top: 180, left: 30, color: '#34D399' }]}>✨</Text>
        <Text style={[styles.floatingSymbol, { top: 220, right: 40, color: '#10B981' }]}>✦</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.statusScrollContent,
          { paddingTop: Math.max(insets.top + 30, 50), paddingBottom: Math.max(insets.bottom + 24, 40) },
        ]}
        bounces={false}
      >
        {/* Delivery Scooter / Success Badge */}
        <View style={styles.underProgressIllustrationBox}>
          <Image
            source={require('../assets/delivery_boy_scooter.png')}
            style={styles.underProgressScooterImg}
            resizeMode="contain"
          />
        </View>

        {/* Title: Request Approved */}
        <View style={styles.titleWavyRow}>
          <Text style={styles.wavyDecorationText}>✨</Text>
          <Text style={[styles.statusTitleRed, { color: '#059669' }]}>Request Approved!</Text>
          <Text style={styles.wavyDecorationText}>✨</Text>
        </View>

        {/* Subtitle */}
        <Text style={[styles.statusDescriptionText, { color: '#065F46', fontWeight: '600' }]}>
          Your application has been verified &amp; approved by Super Admin.{'\n'}
          Welcome to the Avantika Delivery Fleet!
        </Text>

        {/* Countdown Badge */}
        <View style={{
          backgroundColor: '#D1FAE5',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 30,
          borderWidth: 1.5,
          borderColor: '#10B981',
          marginVertical: 20,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#047857' }}>
            Rendering Home Screen in {countdown}s...
          </Text>
        </View>

        {/* Instant Go to Home Button */}
        <TouchableOpacity
          style={[styles.darkProceedButton, { backgroundColor: '#059669', marginTop: 10 }]}
          onPress={onNavigateToHome}
          activeOpacity={0.85}
        >
          <Text style={styles.darkProceedButtonText}>Go to Home Now →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
