import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WelcomeSectionProps {
  userName: string;
  subtitle?: string;
}

export default function WelcomeSection({ userName, subtitle = "Here's your business overview" }: WelcomeSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeTitle}>{getGreeting()}, {userName}!</Text>
      <Text style={styles.welcomeSubtitle}>{subtitle}</Text>
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