import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  // switch between english and portuguese
  const handleToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newLang = language === 'en' ? 'pt' : 'en';
    await setLanguage(newLang);
  };

  return (
    <Pressable onPress={handleToggle} style={styles.button}>
      <View style={styles.content}>
        <Ionicons name="globe-outline" size={16} color="#007AFF" />
        <Text style={styles.text}>{language.toUpperCase()}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});