import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionCardProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function QuickActionCard({ title, iconName, onPress }: QuickActionCardProps) {
  return (
    <Pressable 
      style={styles.quickActionCard}
      onPress={onPress}
    >
      <View style={styles.quickActionIcon}>
        <Ionicons name={iconName} size={28} color="#007AFF" />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  quickActionCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});