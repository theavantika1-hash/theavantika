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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/appStyles';

export function RegisterDetailsScreen({
  initialEmail,
  onBack,
  onSubmit,
}: {
  initialEmail: string;
  onBack: () => void;
  onSubmit: (details: { fullName: string; phone: string; email: string }) => void;
}) {
  const insets = useSafeAreaInsets();
  const [email] = useState(initialEmail);
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleSubmit = () => {
    if (!fullName) {
      Alert.alert('Required', 'Please enter your Full Name.');
      return;
    }
    if (!dob) {
      Alert.alert('Required', 'Please enter your Date of Birth.');
      return;
    }
    if (!phone) {
      Alert.alert('Required', 'Please enter your Mobile Number.');
      return;
    }
    onSubmit({ fullName, phone, email });
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
        {/* Top Header Row with Back Arrow, Register Title, and Step Counter */}
        <View style={[styles.detailsHeaderRow, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.detailsBackTouch}>
            <Text style={styles.detailsBackArrow}>←</Text>
            <Text style={styles.detailsHeaderTitle}>Register</Text>
          </TouchableOpacity>

          <View style={styles.stepCounterBox}>
            <Text style={styles.stepNumText}>1</Text>
            <Text style={styles.stepDenomText}>/4</Text>
          </View>
        </View>

        {/* Section Divider: Verify Details */}
        <View style={styles.sectionDividerRow}>
          <View style={styles.sectionDividerLine} />
          <Text style={styles.sectionDividerText}>Verify Details</Text>
          <View style={styles.sectionDividerLine} />
        </View>

        {/* Body Form Container */}
        <View style={styles.detailsBodyContainer}>
          {/* Email Field with Verified Teal Checkmark */}
          <View style={[styles.inputContainer, styles.inputVerifiedContainer]}>
            <View style={styles.inputIconBox}>
              <Text style={styles.inputIconText}>👤</Text>
            </View>
            <View style={styles.inputSeparator} />
            <TextInput
              style={styles.textInput}
              value={email}
              editable={false}
              placeholderTextColor="#94A3B8"
            />
            <View style={styles.checkCircleBox}>
              <Text style={styles.checkIconText}>✓</Text>
            </View>
          </View>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIconBox}>
              <Text style={styles.inputIconText}>👤</Text>
            </View>
            <View style={styles.inputSeparator} />
            <TextInput
              style={styles.textInput}
              placeholder="Full Name"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Date of Birth Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIconBox}>
              <Text style={styles.inputIconText}>📅</Text>
            </View>
            <View style={styles.inputSeparator} />
            <TextInput
              style={styles.textInput}
              placeholder="Date of Birth"
              placeholderTextColor="#94A3B8"
              value={dob}
              onChangeText={setDob}
            />
          </View>

          {/* Mobile Number Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIconBox}>
              <Text style={styles.inputIconText}>📞</Text>
            </View>
            <View style={styles.inputSeparator} />
            <TextInput
              style={styles.textInput}
              placeholder="Mobile Number"
              placeholderTextColor="#94A3B8"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Gender Selector Radio Row */}
          <View style={styles.genderRow}>
            {/* Male Radio */}
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setGender('male')}
              activeOpacity={0.8}
            >
              <View style={[styles.radioCircle, gender === 'male' && styles.radioCircleSelected]}>
                {gender === 'male' && <Text style={styles.radioCheckMark}>✓</Text>}
              </View>
              <Text style={styles.radioLabelText}>Male</Text>
            </TouchableOpacity>

            {/* Female Radio */}
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setGender('female')}
              activeOpacity={0.8}
            >
              <View style={[styles.radioCircle, gender === 'female' && styles.radioCircleSelected]}>
                {gender === 'female' && <Text style={styles.radioCheckMark}>✓</Text>}
              </View>
              <Text style={styles.radioLabelText}>Female</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Dark Pill Button */}
          <View style={{ marginBottom: Math.max(insets.bottom, 28), marginTop: 24 }}>
            <TouchableOpacity
              style={styles.darkProceedButton}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.darkProceedButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
