import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/appStyles';
import { deliveryBoyApi } from '../config/api';

export function RegisterScreen({
  onBack,
  onNavigateToLogin,
  onProceedToOtp,
}: {
  onBack: () => void;
  onNavigateToLogin: () => void;
  onProceedToOtp: (email: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProceed = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      Alert.alert('Required', 'Please enter your email to continue.');
      return;
    }
    setIsLoading(true);
    try {
      await deliveryBoyApi.sendOtp({ email: cleanEmail });
      onProceedToOtp(cleanEmail);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send verification OTP');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.loginScrollContainer}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Wavy Yellow Top Background Header */}
        <View style={[styles.registerTopBackground, { paddingTop: Math.max(insets.top, 16) }]}>
          <View style={styles.registerCurveBacking} />
          <View style={styles.registerCurveBackingSecondary} />
          <TouchableOpacity
            style={styles.registerBackButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.registerBackArrowText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <View style={styles.registerBodyContainer}>
          <Text style={styles.registerHeading}>Register</Text>
          <Text style={styles.registerSubheading}>Please enter your email to continue</Text>

          {/* Email Input Field */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIconBox}>
              <Text style={styles.inputIconText}>👤</Text>
            </View>
            <View style={styles.inputSeparator} />
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Terms & Privacy Notice */}
          <Text style={styles.termsNoticeText}>
            By clicking on “Proceed”, you agree to our{' '}
            <Text
              style={styles.termsHighlightText}
              onPress={() => Alert.alert('Terms', 'Opening Terms & Conditions...')}
            >
              Terms & Conditions
            </Text>{' '}
            and{' '}
            <Text
              style={styles.termsHighlightText}
              onPress={() => Alert.alert('Privacy', 'Opening Privacy Policy...')}
            >
              Privacy Policy
            </Text>
            .
          </Text>

          {/* Primary Action Button: Dark Pill Proceed */}
          <TouchableOpacity
            style={styles.darkProceedButton}
            onPress={handleProceed}
            activeOpacity={0.85}
          >
            <Text style={styles.darkProceedButtonText}>Proceed</Text>
          </TouchableOpacity>

          {/* Continue with Divider */}
          <View style={styles.socialDividerRow}>
            <View style={styles.socialDividerLine} />
            <Text style={styles.socialDividerText}>Continue with</Text>
            <View style={styles.socialDividerLine} />
          </View>

          {/* Social Login Circles */}
          <View style={styles.socialButtonsRow}>
            {/* Facebook */}
            <TouchableOpacity
              style={[styles.socialCircle, { backgroundColor: '#1877F2' }]}
              onPress={() => Alert.alert('Facebook', 'Proceeding with Facebook...')}
              activeOpacity={0.8}
            >
              <Text style={styles.socialIconText}>f</Text>
            </TouchableOpacity>

            {/* Twitter */}
            <TouchableOpacity
              style={[styles.socialCircle, { backgroundColor: '#38BDF8' }]}
              onPress={() => Alert.alert('Twitter', 'Proceeding with Twitter...')}
              activeOpacity={0.8}
            >
              <Text style={styles.socialIconText}>t</Text>
            </TouchableOpacity>

            {/* Google+ */}
            <TouchableOpacity
              style={[styles.socialCircle, { backgroundColor: '#EA4335' }]}
              onPress={() => Alert.alert('Google+', 'Proceeding with Google+...')}
              activeOpacity={0.8}
            >
              <Text style={styles.socialIconTextSmall}>g+</Text>
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity
              style={[styles.socialCircle, { backgroundColor: '#18181B' }]}
              onPress={() => Alert.alert('Apple', 'Proceeding with Apple...')}
              activeOpacity={0.8}
            >
              <Text style={styles.socialIconText}></Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Footer Link */}
          <View style={[styles.registerFooter, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <Text style={styles.dontHaveAccountText}>Already Have an Account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
              <Text style={styles.loginLinkHighlightText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
