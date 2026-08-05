import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/appStyles';

const MOCK_SUGGESTIONS = [
  {
    id: '1',
    title: 'Phase-II, Urban Estate',
    subtitle: '#321, Phase-II, UE, Ludhiana, Punjab, India',
  },
  {
    id: '2',
    title: 'Model Town',
    subtitle: 'Model Town Extension, Ludhiana, Punjab, India',
  },
  {
    id: '3',
    title: 'Sarabha Nagar',
    subtitle: 'Kippss Market, Sarabha Nagar, Ludhiana, Punjab',
  },
  {
    id: '4',
    title: 'BRS Nagar',
    subtitle: 'Bhai Randhir Singh Nagar, Ludhiana, Punjab',
  },
  {
    id: '5',
    title: 'Ferozepur Road',
    subtitle: 'Near Westend Mall, Ferozepur Road, Ludhiana',
  },
];

export function LocationPickerScreen({
  onBack,
  onSelectLocation,
}: {
  onBack: () => void;
  onSelectLocation: (locText: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');

  const filteredSuggestions = MOCK_SUGGESTIONS.filter(
    item =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* TOP SEARCH HEADER BAR */}
        <View
          style={[
            styles.locationHeaderBar,
            { paddingTop: Math.max(insets.top, 16) },
          ]}
        >
          <TouchableOpacity
            style={styles.locationBackTouch}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.locationBackArrowText}>←</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.locationSearchInput}
            placeholder="Type your location"
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />

          <View style={styles.locationHeaderRightIconBox}>
            <Text style={{ fontSize: 22 }}>📍</Text>
          </View>
        </View>

        {/* USE CURRENT LOCATION BUTTON */}
        <View style={styles.locationActionPillContainer}>
          <TouchableOpacity
            style={styles.useCurrentLocationBtn}
            onPress={() => onSelectLocation('#321, Phase-II, UE, Ludhiana, India')}
            activeOpacity={0.85}
          >
            <Text style={styles.useCurrentLocationGpsIcon}>🎯</Text>
            <Text style={styles.useCurrentLocationBtnText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>

        {/* SUGGESTED LOCATIONS LIST */}
        <ScrollView
          contentContainerStyle={styles.locationSuggestionsList}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.locationSectionHeaderLabel}>RECENT & NEARBY LOCATIONS</Text>

          {(searchText ? filteredSuggestions : MOCK_SUGGESTIONS).map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.locationSuggestionItem}
              onPress={() => onSelectLocation(item.subtitle)}
              activeOpacity={0.7}
            >
              <View style={styles.locationSuggestionIconCircle}>
                <Text style={{ fontSize: 18 }}>📍</Text>
              </View>

              <View style={styles.locationSuggestionTextCol}>
                <Text style={styles.locationSuggestionTitle}>{item.title}</Text>
                <Text style={styles.locationSuggestionSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
