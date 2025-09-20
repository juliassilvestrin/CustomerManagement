import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function Jobs() {
  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="construct-outline" size={64} color="#007AFF" />
        </View>
        <Text style={styles.title}>jobs coming soon!</Text>
        <Text style={styles.subtitle}>this feature is under development</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});