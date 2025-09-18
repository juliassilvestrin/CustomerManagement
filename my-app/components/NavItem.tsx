import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface NavItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
}

export default function NavItem({ iconName, label, isActive, isDisabled = false, onPress }: NavItemProps) {
  const iconColor = isActive ? '#007AFF' : '#8E8E93';
  const labelColor = isActive ? '#007AFF' : '#8E8E93';

  if (isDisabled) {
    return (
      <View style={styles.navItem}>
        {/* blurred backgoryn */}
        <BlurView 
          intensity={60} 
          tint="light" 
          style={styles.blurBackground}
        />
        {/* icons on top */}
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={24} color="#D1D5DB" />
          <Text style={[styles.navLabel, { color: "#D1D5DB" }]}>{label}</Text>
        </View>
      </View>
    );
  }

  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <Ionicons name={iconName} size={24} color={iconColor} />
      <Text style={[styles.navLabel, { color: labelColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  blurBackground: {
    position: 'absolute',
    top: 4,
    left: 8,
    right: 8,
    bottom: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  iconContainer: {
    alignItems: 'center',
    zIndex: 1, //make sure icoins are on top of the blur
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
});