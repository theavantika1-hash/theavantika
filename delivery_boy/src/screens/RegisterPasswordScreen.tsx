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

export function RegisterPasswordScreen({
  registrationDetails,
  onBack,
  onSubmit,
}: {
  registrationDetails?: { fullName: string; phone: string; email: string };
  onBack: () => void;
  onSubmit: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveAndNext = async () => {
    if (!password) {
      Alert.alert('Required', 'Please enter a password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password should be at least 6 characters long.');
      return;
    }
    if (!confirmPassword) {
      Alert.alert('Required', 'Please confirm your password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match. Please re-enter.');
      return;
    }

    if (registrationDetails) {
      setIsLoading(true);
      try {
        await deliveryBoyApi.register({
          name: registrationDetails.fullName,
          email: registrationDetails.email,
          phone: registrationDetails.phone,
          password: password,
        });
        onSubmit();
      } catch (err: any) {
        Alert.alert('Registration Error', err.message || 'Failed to complete registration');
      } finally {
        setIsLoading(false);
      }
    } else {
      onSubmit();
    }
  };




  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.detailsScrollContainer}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Top Header Row with Back Arrow, Register Title, and 2/4 Step Counter */}
        <View style={[styles.detailsHeaderRow, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.detailsBackTouch}>
            <Text style={styles.detailsBackArrow}>←</Text>
            <Text style={styles.detailsHeaderTitle}>Register</Text>
          </TouchableOpacity>

          <View style={styles.stepCounterBox}>
            <Text style={styles.stepNumText}>2</Text>
            <Text style={styles.stepDenomText}>/4</Text>
          </View>
        </View>

        {/* Section Divider: Set Password */}
        <View style={styles.sectionDividerRow}>
          <View style={styles.sectionDividerLine} />
          <Text style={styles.sectionDividerText}>Set Password</Text>
          <View style={styles.sectionDividerLine} />
        </View>

        {/* Body Container */}
        <View style={styles.detailsBodyContainer}>
          {/* Description Subtitle */}
          <Text style={styles.passwordDescriptionText}>
            Set your password so you can sign in directly with your email next time
          </Text>

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

          {/* Confirm Password Input Field */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIconBox}>
              <Text style={styles.inputIconText}>🔒</Text>
            </View>
            <View style={styles.inputSeparator} />
            <TextInput
              style={styles.textInput}
              placeholder="*******"
              placeholderTextColor="#94A3B8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!isConfirmPasswordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIconButton}
              onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              activeOpacity={0.7}
            >
              <Text style={styles.eyeIconText}>
                {isConfirmPasswordVisible ? '👁️' : '🙈'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Save & Next Dark Pill Button */}
          <View style={{ marginBottom: Math.max(insets.bottom, 28), marginTop: 40 }}>
            <TouchableOpacity
              style={styles.darkProceedButton}
              onPress={handleSaveAndNext}
              activeOpacity={0.85}
            >
              <Text style={styles.darkProceedButtonText}>Save & Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
