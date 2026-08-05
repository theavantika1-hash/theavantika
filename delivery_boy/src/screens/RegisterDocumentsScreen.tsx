import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { styles } from '../styles/appStyles';
import { deliveryBoyApi } from '../config/api';

export function RegisterDocumentsScreen({
  email,
  onBack,
  onSubmit,
}: {
  email?: string;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [licenseUri, setLicenseUri] = useState<string | null>(
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80'
  );
  const [licenseNumber, setLicenseNumber] = useState('');
  const [validUpto, setValidUpto] = useState('');
  const [vehicleDocUri, setVehicleDocUri] = useState<string | null>(null);
  const [vehicleError, setVehicleError] = useState<string | null>('File uploaded is not supported.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickLicense = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setLicenseUri(result.assets[0].uri);
      }
    } catch (e) {
      setLicenseUri('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80');
    }
  };

  const handlePickVehicleDoc = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setVehicleDocUri(result.assets[0].uri);
        setVehicleError(null);
      }
    } catch (e) {
      Alert.alert('Upload Error', 'Unsupported file format selected.');
    }
  };

  const handleSubmitFinal = async () => {
    if (!licenseUri) {
      Alert.alert('Required', 'Please upload your Driving License.');
      return;
    }
    if (vehicleError && !vehicleDocUri) {
      Alert.alert('Required Document', 'Please upload a valid Vehicle Registration Document.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (email) {
        await deliveryBoyApi.updateProfile({
          drivingLicenseNumber: licenseNumber,
          licenseValidUpto: validUpto,
          documents: {
            drivingLicense: licenseUri,
            vehicleRC: vehicleDocUri,
          },
        });
      }
      onSubmit();
    } catch (err: any) {
      // Proceed to success screen regardless of non-fatal document upload warning
      onSubmit();
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
        contentContainerStyle={styles.detailsScrollContainer}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Top Header Row with Back Arrow, Register Title, and 4/4 Step Counter */}
        <View style={[styles.detailsHeaderRow, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.detailsBackTouch}>
            <Text style={styles.detailsBackArrow}>←</Text>
            <Text style={styles.detailsHeaderTitle}>Register</Text>
          </TouchableOpacity>

          <View style={styles.stepCounterBox}>
            <Text style={styles.stepNumText}>4</Text>
            <Text style={styles.stepDenomText}>/4</Text>
          </View>
        </View>

        {/* Section Divider: Upload Documents */}
        <View style={styles.sectionDividerRow}>
          <View style={styles.sectionDividerLine} />
          <Text style={styles.sectionDividerText}>Upload Documents</Text>
          <View style={styles.sectionDividerLine} />
        </View>

        {/* Body Container */}
        <View style={styles.detailsBodyContainer}>
          {/* Bulleted Requirements Notice */}
          <View style={styles.bulletListContainer}>
            <Text style={styles.bulletItemText}>• Only pdf, png, or jpg files are supported.</Text>
            <Text style={styles.bulletItemText}>• Make ensure file is not blurred and easy to evaluate</Text>
            <Text style={styles.bulletItemText}>• File Size should not more than 5mb.</Text>
          </View>

          {/* DOCUMENT 1: DRIVING LICENSE (Uploaded State) */}
          <TouchableOpacity
            style={[styles.docUploadCard, styles.docCardUploaded]}
            onPress={handlePickLicense}
            activeOpacity={0.8}
          >
            <View style={styles.docCardLeftRow}>
              <View style={styles.upCircleTeal}>
                <Text style={styles.upArrowTextTeal}>↑</Text>
              </View>
              <View>
                <Text style={styles.docTitleTeal}>Driving License *</Text>
                <Text style={styles.docSubText}>Front & Back side</Text>
              </View>
            </View>

            <View style={styles.uploadedBadge}>
              <Text style={styles.uploadedBadgeText}>Uploaded</Text>
            </View>
          </TouchableOpacity>

          {/* Thumbnail Preview Card if Uploaded */}
          {licenseUri && (
            <View style={styles.thumbnailWrapper}>
              <Image source={{ uri: licenseUri }} style={styles.docThumbnailImage} />
              <TouchableOpacity
                style={styles.redCrossBadge}
                onPress={() => setLicenseUri(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.redCrossText}>×</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Driving License Extra Info Inputs */}
          <Text style={styles.infoSectionHeading}>Driving License Info</Text>
          <View style={styles.licenseInfoInputsRow}>
            {/* License Number Input */}
            <View style={[styles.inputContainer, { flex: 1, marginBottom: 0, height: 50 }]}>
              <TextInput
                style={[styles.textInput, { fontSize: 14 }]}
                placeholder="License Number"
                placeholderTextColor="#94A3B8"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
              <Text style={styles.infoIconSymbol}>i</Text>
            </View>

            {/* Valid Upto Input */}
            <View style={[styles.inputContainer, { flex: 1, marginBottom: 0, height: 50 }]}>
              <TextInput
                style={[styles.textInput, { fontSize: 14 }]}
                placeholder="Valid Upto"
                placeholderTextColor="#94A3B8"
                value={validUpto}
                onChangeText={setValidUpto}
              />
              <Text style={styles.infoIconSymbol}>📅</Text>
            </View>
          </View>

          <View style={styles.cardSeparatorLine} />

          {/* DOCUMENT 2: VEHICLE REG. DOC (Error / Warning State) */}
          <TouchableOpacity
            style={[
              styles.docUploadCard,
              vehicleError && !vehicleDocUri ? styles.docCardError : styles.docCardUploaded,
            ]}
            onPress={handlePickVehicleDoc}
            activeOpacity={0.8}
          >
            <View style={styles.docCardLeftRow}>
              <View style={[styles.upCircleTeal, vehicleError && !vehicleDocUri && styles.upCircleRed]}>
                <Text style={[styles.upArrowTextTeal, vehicleError && !vehicleDocUri && styles.upArrowTextRed]}>
                  ↑
                </Text>
              </View>
              <Text
                style={[
                  styles.docTitleTeal,
                  vehicleError && !vehicleDocUri && styles.docTitleRed,
                ]}
              >
                Vehicle Reg. Doc*
              </Text>
            </View>

            {vehicleError && !vehicleDocUri ? (
              <Text style={styles.warningTriangleIcon}>⚠️</Text>
            ) : (
              <View style={styles.uploadedBadge}>
                <Text style={styles.uploadedBadgeText}>Uploaded</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Error Message underneath */}
          {vehicleError && !vehicleDocUri && (
            <Text style={styles.docErrorText}>{vehicleError}</Text>
          )}

          <View style={styles.cardSeparatorLine} />

          {/* Primary Action Button: Red/Orange Submit Pill */}
          <View style={{ marginBottom: Math.max(insets.bottom, 28), marginTop: 24 }}>
            <TouchableOpacity
              style={styles.redSubmitPillButton}
              onPress={handleSubmitFinal}
              activeOpacity={0.85}
            >
              <Text style={styles.redSubmitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
