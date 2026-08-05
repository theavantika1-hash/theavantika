import React, { useState, useRef, useEffect } from 'react';
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

export function OtpVerificationScreen({
  email,
  onBack,
  onVerifySuccess,
}: {
  email: string;
  onBack: () => void;
  onVerifySuccess: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(49);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerSeconds]);

  const handleTextChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleanText.slice(-1);
    setOtpDigits(newDigits);

    if (cleanText && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (timerSeconds === 0) {
      setIsSubmitting(true);
      try {
        await deliveryBoyApi.sendOtp({ email });
        setTimerSeconds(49);
        Alert.alert('OTP Resent', `A new 4-digit code was sent to ${email}`);
      } catch (err: any) {
        Alert.alert('Resend Failed', err.message || 'Failed to resend OTP');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleVerify = async () => {
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 4) {
      Alert.alert('Incomplete OTP', 'Please enter the 4-digit code sent to your email.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await deliveryBoyApi.verifyOtp({ email, otp: fullOtp });
      Alert.alert('Verified', res.message || 'Email verified successfully!');
      onVerifySuccess();
    } catch (err: any) {
      Alert.alert('Verification Failed', err.message || 'Invalid or expired OTP');
    } finally {
      setIsSubmitting(false);
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
        {/* Yellow Header Wave */}
        <View style={[styles.otpTopBackground, { paddingTop: Math.max(insets.top, 16) }]}>
          <View style={styles.otpCurveBacking} />
          <View style={styles.otpCurveBackingSecondary} />
          <TouchableOpacity
            style={styles.otpBackButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.otpBackArrowText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <View style={styles.otpBodyContainer}>
          <Text style={styles.otpHeading}>OTP Verification</Text>
          <Text style={styles.otpSubheading}>
            Enter the 4-digit OTP sent to your email{' '}
            <Text style={styles.boldEmailText}>{email}</Text>
          </Text>

          {/* 4-Digit Input Boxes */}
          <View style={styles.otpInputsRow}>
            {otpDigits.map((digit, index) => {
              const isFocused = focusedIndex === index;
              const isFilled = !!digit;
              return (
                <TextInput
                  key={index}
                  ref={ref => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpBox,
                    isFocused && styles.otpBoxFocused,
                    isFilled && styles.otpBoxFilled,
                  ]}
                  value={digit}
                  onChangeText={text => handleTextChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  onFocus={() => setFocusedIndex(index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  textAlign="center"
                />
              );
            })}
          </View>

          {/* Timer & Resend Option */}
          <View style={styles.timerContainer}>
            {timerSeconds > 0 ? (
              <Text style={styles.timerText}>
                Resend Code in <Text style={styles.timerHighlight}>{timerSeconds}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={styles.resendLinkText}>
                  Didn’t receive code? <Text style={styles.resendBoldText}>Resend OTP</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            activeOpacity={0.85}
          >
            <Text style={styles.verifyButtonText}>Verify & Proceed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
