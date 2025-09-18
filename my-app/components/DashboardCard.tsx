import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DashboardCardProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  title: string;
  number?: string | number;
  onPress?: () => void;
}

export default function DashboardCard({ iconName, title, number, onPress }: DashboardCardProps) {
  const CardComponent = onPress ? Pressable : View;

  return (
    <CardComponent style={styles.card} onPress={onPress}>
      {iconName && (
        <View style={styles.cardIcon}>
          <Ionicons name={iconName} size={28} color="#007AFF" />
        </View>
      )}
      {number && <Text style={styles.cardNumber}>{number}</Text>}
      <Text style={styles.cardTitle}>{title}</Text>
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'rgba(0, 122, 255, 0.03)',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.08)',
  },
  cardIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
    textAlign: 'center',
  },
});