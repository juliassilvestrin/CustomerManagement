import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface CustomerCardProps {
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
    jobs: number;
  };
  onPress: () => void;
}

export const CustomerCard = ({ customer, onPress }: CustomerCardProps) => {
  return (
    <Pressable style={styles.customerCard} onPress={onPress}>
      <View style={styles.customerHeader}>
        <Text style={styles.customerName}>{customer.name}</Text>
        <Text style={styles.jobCount}>{customer.jobs} jobs</Text>
      </View>
      <Text style={styles.customerInfo}>{customer.email}</Text>
      <Text style={styles.customerInfo}>{customer.phone}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  customerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  jobCount: {
    color: '#007AFF',
    fontWeight: '500',
  },
  customerInfo: {
    color: '#6c757d',
    fontSize: 14,
    marginBottom: 2,
  },
});