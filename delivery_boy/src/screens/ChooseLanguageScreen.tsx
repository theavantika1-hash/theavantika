import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface LanguageItem {
  id: string;
  name: string;
  flag: string;
}

export const LANGUAGES: LanguageItem[] = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { id: 'it', name: 'Italiano', flag: '🇮🇹' },
  { id: 'pt', name: 'Português', flag: '🇵🇹' },
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'ar', name: 'عربي', flag: '🇦🇪' },
  { id: 'hi', name: 'हिंदी', flag: '🇮🇳' },
];

interface ChooseLanguageScreenProps {
  onBack: () => void;
  selectedLanguageId?: string;
  onSelectLanguage: (lang: LanguageItem) => void;
}

export function ChooseLanguageScreen({
  onBack,
  selectedLanguageId = 'en',
  onSelectLanguage,
}: ChooseLanguageScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={langStyles.container}>
      {/* 1. TOP HEADER BAR */}
      <View style={[langStyles.headerBar, { paddingTop: Math.max(insets.top + 6, 16) }]}>
        <TouchableOpacity style={langStyles.headerBackBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={langStyles.headerBackArrow}>←</Text>
        </TouchableOpacity>
        <Text style={langStyles.headerTitleText}>Choose Language</Text>
      </View>

      {/* 2. LANGUAGES LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 20, 30),
        }}
      >
        {LANGUAGES.map((item) => {
          const isSelected = item.id === selectedLanguageId;

          return (
            <TouchableOpacity
              key={item.id}
              style={[langStyles.languageItemRow, isSelected && langStyles.languageItemRowSelected]}
              onPress={() => {
                onSelectLanguage(item);
                onBack();
              }}
              activeOpacity={0.7}
            >
              <View style={langStyles.languageLeftContent}>
                <Text style={langStyles.flagText}>{item.flag}</Text>
                <Text style={[langStyles.languageNameText, isSelected && langStyles.languageNameTextSelected]}>
                  {item.name}
                </Text>
              </View>

              {isSelected && <Text style={langStyles.checkmarkIcon}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const langStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerBackBtn: {
    paddingRight: 16,
    paddingVertical: 4,
  },
  headerBackArrow: {
    fontSize: 24,
    color: '#1E293B',
    fontWeight: '700',
  },
  headerTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  languageItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
  },
  languageItemRowSelected: {
    backgroundColor: '#F8FAFC',
  },
  languageLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 24,
    marginRight: 16,
  },
  languageNameText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1E293B',
  },
  languageNameTextSelected: {
    fontWeight: '700',
    color: '#0F172A',
  },
  checkmarkIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4CA687',
  },
});
