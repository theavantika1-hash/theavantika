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
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/appStyles';
import { deliveryBoyApi } from '../config/api';

export function LoginScreen({
  onNavigateToOnboarding,
  onNavigateToRegister,
  onNavigateToOtp,
  onLoginSuccess,
}: {
  onNavigateToOnboarding: () => void;
  onNavigateToRegister: () => void;
  onNavigateToOtp: (email: string) => void;
  onLoginSuccess?: (email: string, approvalStatus?: string) => void;
}) {

  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP Modal States
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<'input_email' | 'enter_otp'>('input_email');

  const handleProceedPassword = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      Alert.alert('Required', 'Please enter your email address.');
      return;
    }
    if (!password) {
      Alert.alert('Required', 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await deliveryBoyApi.login({ email: cleanEmail, password });
      if (!res.isVerified) {
        Alert.alert('Verification Required', res.message || 'Verification OTP sent to your email.');
        onNavigateToOtp(cleanEmail);
      } else {
        const approvalStatus = res.approvalStatus || res.data?.approvalStatus || res.data?.deliveryBoy?.approvalStatus || res.deliveryBoy?.approvalStatus || 'pending';
        if (onLoginSuccess) {
          onLoginSuccess(cleanEmail, approvalStatus);
        }
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };


  const handleOpenOtpModal = async () => {
    const cleanEmail = email.trim();
    if (cleanEmail) {
      setIsLoading(true);
      try {
        await deliveryBoyApi.sendOtp({ email: cleanEmail });
        onNavigateToOtp(cleanEmail);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to send OTP');
      } finally {
        setIsLoading(false);
      }
    } else {
      setOtpEmail('');
      setOtpStep('input_email');
      setIsOtpModalVisible(true);
    }
  };

  const handleCloseOtpModal = () => {
    setIsOtpModalVisible(false);
  };

  const handleOtpProceed = async () => {
    if (otpStep === 'input_email') {
      const cleanEmail = otpEmail.trim();
      if (!cleanEmail) {
        Alert.alert('Required', 'Please enter your email address to receive OTP.');
        return;
      }
      setIsLoading(true);
      try {
        await deliveryBoyApi.sendOtp({ email: cleanEmail });
        setIsOtpModalVisible(false);
        onNavigateToOtp(cleanEmail);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to send OTP');
      } finally {
        setIsLoading(false);
      }
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
        {/* Top Header Background Wave with Back Arrow */}
        <View style={[styles.loginTopBackground, { paddingTop: Math.max(insets.top, 16) }]}>
          <View style={styles.loginCurveBacking} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={onNavigateToOnboarding}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrowText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Form Body Container */}
        <View style={styles.loginBodyContainer}>
          <Text style={styles.loginHeading}>Login</Text>
          <Text style={styles.loginSubheading}>
            Please fill in the following form to continue
          </Text>

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
            {email.length > 3 && <Text style={styles.checkIcon}>✓</Text>}
          </View>

          {/* Password Input Field */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIconBox}>
              <Text style={styles.inputIconText}>🔒</Text>
            </View>
            <View style={styles.inputSeparator} />
            <TextInput
              style={styles.textInput}
              placeholder="*******"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIconButton}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              activeOpacity={0.7}
            >
              <Text style={styles.eyeIconText}>
                {isPasswordVisible ? '👁️' : '🙈'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => Alert.alert('Reset Password', 'A reset link was sent to your email.')}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Primary CTA Button: Proceed */}
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={handleProceedPassword}
            activeOpacity={0.85}
          >
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </TouchableOpacity>

          {/* Or Try Another Way Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or Try another way</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Secondary Action: Proceed via OTP */}
          <TouchableOpacity
            style={styles.otpButton}
            onPress={handleOpenOtpModal}
            activeOpacity={0.85}
          >
            <Text style={styles.otpButtonText}>Proceed via OTP</Text>
          </TouchableOpacity>

          {/* Bottom Register Footer Link */}
          <View style={[styles.registerFooter, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <Text style={styles.dontHaveAccountText}>Don’t Have an Account? </Text>
            <TouchableOpacity
              onPress={onNavigateToRegister}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLinkText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ---------------------------------------------------- */}
      {/* BOTTOM SHEET MODAL: PROCEED WITH EMAIL OTP           */}
      {/* ---------------------------------------------------- */}
      <Modal
        visible={isOtpModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseOtpModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouchable}
            activeOpacity={1}
            onPress={handleCloseOtpModal}
          />

          <View style={[styles.bottomSheetContainer, { paddingBottom: Math.max(insets.bottom, 28) }]}>
            {/* Red Circular Close Button overlapping top-right */}
            <TouchableOpacity
              style={styles.closeCircleButton}
              onPress={handleCloseOtpModal}
              activeOpacity={0.8}
            >
              <Text style={styles.closeCrossText}>✕</Text>
            </TouchableOpacity>

            {/* Modal Title */}
            <Text style={styles.modalTitle}>
              {otpStep === 'input_email' ? 'Enter your Email Address' : 'Enter 6-Digit OTP'}
            </Text>

            {/* Email or OTP Input Field */}
            {otpStep === 'input_email' ? (
              <View style={styles.modalInputContainer}>
                <View style={styles.inputIconBox}>
                  <Text style={styles.inputIconText}>✉️</Text>
                </View>
                <View style={styles.inputSeparator} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email Address"
                  placeholderTextColor="#94A3B8"
                  value={otpEmail}
                  onChangeText={setOtpEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus={true}
                />
              </View>
            ) : (
              <View>
                <Text style={styles.otpSubtitle}>
                  We sent a 6-digit verification code to <Text style={styles.boldEmail}>{otpEmail}</Text>
                </Text>
                <View style={styles.modalInputContainer}>
                  <View style={styles.inputIconBox}>
                    <Text style={styles.inputIconText}>💬</Text>
                  </View>
                  <View style={styles.inputSeparator} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor="#94A3B8"
                    value={otpCode}
                    onChangeText={setOtpCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus={true}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => Alert.alert('OTP Resent', `A new code was sent to ${otpEmail}`)}
                  style={styles.resendContainer}
                >
                  <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendBold}>Resend OTP</Text></Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Modal Proceed Button */}
            <TouchableOpacity
              style={styles.modalProceedButton}
              onPress={handleOtpProceed}
              activeOpacity={0.85}
            >
              <Text style={styles.modalProceedButtonText}>
                {otpStep === 'input_email' ? 'Proceed' : 'Verify & Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
