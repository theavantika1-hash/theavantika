import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ONBOARDING_STEPS } from '../constants/onboardingData';
import { styles } from '../styles/appStyles';

export function OnboardingScreen({ onNavigateToLogin }: { onNavigateToLogin: () => void }) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (nextStep: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentStep(nextStep);
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      animateTransition(currentStep + 1);
    } else {
      onNavigateToLogin();
    }
  };

  const handleSkip = () => {
    onNavigateToLogin();
  };

  const stepData = ONBOARDING_STEPS[currentStep];

  return (
    <View style={styles.container}>
      {/* Top Header Background */}
      <View style={[styles.topBackground, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.curveBacking} />
        <View style={styles.headerBar}>
          <View style={styles.cloudBadge}>
            <View style={styles.utensilCircle}>
              <Text style={styles.utensilsIcon}>🍴</Text>
            </View>
            <Text style={styles.cloudBadgeText}>Food Love</Text>
          </View>

          {currentStep < 2 && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.75}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.leftTealLeaf}>
          <View style={[styles.leafSegment, styles.leafA]} />
          <View style={[styles.leafSegment, styles.leafB]} />
        </View>

        <View style={styles.rightZigzag}>
          <Text style={styles.zigzagSymbol}>〰️〰️</Text>
        </View>
      </View>

      {/* Main Illustration */}
      <View style={styles.illustrationSection}>
        <Animated.Image
          source={stepData.image}
          style={[styles.illustrationImage, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Content Area */}
      <View style={styles.contentSection}>
        <View style={styles.paginationRow}>
          {ONBOARDING_STEPS.map((_, index) => {
            const isActive = index <= currentStep;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => animateTransition(index)}
                activeOpacity={0.7}
                style={[
                  styles.dot,
                  isActive ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            );
          })}
        </View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          {stepData.type === 'categories' ? (
            <View>
              <Text style={styles.categoryHeading}>{stepData.title}</Text>
              <View style={styles.categoriesGrid}>
                {stepData.categories?.map(item => (
                  <View key={item.id} style={styles.categoryCard}>
                    <View style={styles.categoryIconCircle}>
                      <Text style={styles.categoryEmoji}>{item.icon}</Text>
                    </View>
                    <Text style={styles.categoryLabel}>{item.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View>
              {stepData.greeting && (
                <View style={styles.titleRow}>
                  <Text style={styles.greetingText}>{stepData.greeting}</Text>
                  {stepData.emoji && (
                    <Text style={styles.emoji}>{stepData.emoji}</Text>
                  )}
                </View>
              )}
              <Text style={styles.mainTitle}>{stepData.title}</Text>
              <Text style={styles.descriptionText}>{stepData.description}</Text>
            </View>
          )}
        </Animated.View>

        <View style={[styles.ctaContainer, { paddingBottom: Math.max(insets.bottom, 28) }]}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaButtonText}>{stepData.buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
