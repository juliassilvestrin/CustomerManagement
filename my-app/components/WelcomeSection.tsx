import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

interface WelcomeSectionProps {
  userName: string;
  subtitle?: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  const { t } = useLanguage();

  // get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.welcome.morning');
    if (hour < 18) return t('dashboard.welcome.afternoon');
    return t('dashboard.welcome.evening');
  };

  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeTitle}>{getGreeting()}, {userName}!</Text>
      <Text style={styles.welcomeSubtitle}>{t('dashboard.welcome.subtitle')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
});