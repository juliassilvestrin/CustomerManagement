import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import { Linking, Alert } from 'react-native';

interface MapCardProps {
  address: string;
  title: string;
  latitude?: number;
  longitude?: number;
  buttonText: string;
}

const isValidAddress = (address: string): boolean => {
  if (!address || address.trim() === '' || address === 'N/A') {
    return false;
  }
  

  const hasNumber = /\d/.test(address);
  

  const words = address.trim().split(/\s+/);
  const hasMultipleWords = words.length >= 2;
  
  // check if it's not just random characters 
  const hasSpaces = address.includes(' ');
  
  return hasNumber && hasMultipleWords && hasSpaces;
};

export const MapCard = ({ 
  address, 
  title, 
  latitude = 37.6775,
  longitude = -113.0619,
  buttonText 
}: MapCardProps) => {
  
  
  if (!isValidAddress(address)) {
    return null;
  }

  const coordinates = {
    latitude,
    longitude,
  };

  const handleGetDirections = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!address) {
      Alert.alert('No Address', 'No address available.');
      return;
    }

    const url = `maps://maps.apple.com/?daddr=${encodeURIComponent(address)}`;
    
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Cannot open Maps app');
    }
  };

  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            ...coordinates,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={coordinates}
            title={title}
            description={address}
          />
        </MapView>
        
        <Pressable style={styles.directionsButton} onPress={handleGetDirections}>
          <Ionicons name="navigate" size={20} color="white" />
          <Text style={styles.directionsButtonText}>{buttonText}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    marginHorizontal: 0,
    marginTop: 10,
    marginBottom: 0,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mapWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  map: {
    width: '100%',
    height: 200,
  },
  directionsButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  directionsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});