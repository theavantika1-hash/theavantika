import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { styles } from '../styles/appStyles';

export function RegisterPhotoScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (photoUri: string | null) => void;
}) {
  const insets = useSafeAreaInsets();
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handlePickCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'front',
        quality: 0.8,
        saveToPhotos: true,
      });
      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Camera Error', result.errorMessage || 'Could not open camera.');
        return;
      }
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Camera Error', 'Failed to launch camera.');
    }
  };

  const handlePickGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });
      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Gallery Error', result.errorMessage || 'Could not open gallery.');
        return;
      }
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Gallery Error', 'Failed to launch photo gallery.');
    }
  };

  const handleFetchSocial = (platform: string) => {
    Alert.alert('Fetch Photo', `Fetching profile picture from ${platform}...`, [
      {
        text: 'Use Social Photo',
        onPress: () =>
          setPhotoUri('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSaveAndNext = () => {
    onSubmit(photoUri);
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
        {/* Top Header Row with Back Arrow, Register Title, and 3/4 Step Counter */}
        <View style={[styles.detailsHeaderRow, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.detailsBackTouch}>
            <Text style={styles.detailsBackArrow}>←</Text>
            <Text style={styles.detailsHeaderTitle}>Register</Text>
          </TouchableOpacity>

          <View style={styles.stepCounterBox}>
            <Text style={styles.stepNumText}>3</Text>
            <Text style={styles.stepDenomText}>/4</Text>
          </View>
        </View>

        {/* Section Divider: Upload Photo */}
        <View style={styles.sectionDividerRow}>
          <View style={styles.sectionDividerLine} />
          <Text style={styles.sectionDividerText}>Upload Photo</Text>
          <View style={styles.sectionDividerLine} />
        </View>

        {/* Body Container */}
        <View style={styles.detailsBodyContainer}>
          {/* Subtitle Description */}
          <Text style={styles.passwordDescriptionText}>
            Please upload your profile image to continue
          </Text>

          {/* Center Profile Avatar Box */}
          <View style={styles.avatarContainerCenter}>
            <View style={styles.avatarCardBox}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholderBox}>
                  <View style={styles.avatarHeadCircle} />
                  <View style={styles.avatarBodyCurve} />
                </View>
              )}
            </View>

            {/* Camera & Gallery Action Buttons Row */}
            <View style={styles.uploadOptionsRow}>
              <TouchableOpacity
                style={styles.uploadOptionBtn}
                onPress={handlePickCamera}
                activeOpacity={0.75}
              >
                <Text style={styles.uploadOptionIcon}>📷</Text>
                <Text style={styles.uploadOptionText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadOptionBtn}
                onPress={handlePickGallery}
                activeOpacity={0.75}
              >
                <Text style={styles.uploadOptionIcon}>🖼️</Text>
                <Text style={styles.uploadOptionText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Fetch from Divider */}
          <View style={styles.socialDividerRow}>
            <View style={styles.socialDividerLine} />
            <Text style={styles.socialDividerText}>Fetch from</Text>
            <View style={styles.socialDividerLine} />
          </View>

          {/* Social Icons Row (Facebook, Twitter, Google+) */}
          <View style={styles.socialButtonsRow}>
            {/* Facebook */}
            <TouchableOpacity
              style={[styles.socialCircle, { backgroundColor: '#1877F2' }]}
              onPress={() => handleFetchSocial('Facebook')}
              activeOpacity={0.8}
            >
              <Text style={styles.socialIconText}>f</Text>
            </TouchableOpacity>

            {/* Twitter */}
            <TouchableOpacity
              style={[styles.socialCircle, { backgroundColor: '#38BDF8' }]}
              onPress={() => handleFetchSocial('Twitter')}
              activeOpacity={0.8}
            >
              <Text style={styles.socialIconText}>t</Text>
            </TouchableOpacity>

            {/* Google+ */}
            <TouchableOpacity
              style={[styles.socialCircle, { backgroundColor: '#EA4335' }]}
              onPress={() => handleFetchSocial('Google+')}
              activeOpacity={0.8}
            >
              <Text style={styles.socialIconTextSmall}>g+</Text>
            </TouchableOpacity>
          </View>

          {/* Save & Next Dark Pill Button */}
          <View style={{ marginBottom: Math.max(insets.bottom, 28), marginTop: 10 }}>
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
