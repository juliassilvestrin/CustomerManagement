import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../../contexts/LanguageContext';
import { useReports } from '../hooks/useReports';

export default function AddReport() {
  const { t } = useLanguage();
  const { addReport } = useReports();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState('');

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearForm();
    router.back();
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setPhotoUri('');
  };

  // take photo with camera
  const handleTakePhoto = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    // launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // choose photo from gallery
  const handleChoosePhoto = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Photo library permission is required');
      return;
    }

    // launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // create new report object
    const newReport = {
      title,
      description,
      photoUri,
      date: new Date().toISOString(),
    };

    const savedReport = await addReport(newReport);
    
    if (savedReport) {
      clearForm();
      router.push('/(tabs)/reports');
    } else {
      Alert.alert('Error', 'Failed to save report');
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* nav bar */}
        <View style={styles.navbar}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.navTitle}>{t('addReport.title')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* report title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('addReport.reportTitle')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('addReport.reportTitle')}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('addReport.description')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('addReport.description')}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* photo buttons */}
            <View style={styles.photoSection}>
              <Text style={styles.label}>Photo</Text>
              <View style={styles.photoButtons}>
                <Pressable style={styles.photoButton} onPress={handleTakePhoto}>
                  <Ionicons name="camera" size={24} color="#007AFF" />
                  <Text style={styles.photoButtonText}>{t('addReport.takePhoto')}</Text>
                </Pressable>

                <Pressable style={styles.photoButton} onPress={handleChoosePhoto}>
                  <Ionicons name="images" size={24} color="#007AFF" />
                  <Text style={styles.photoButtonText}>{t('addReport.choosePhoto')}</Text>
                </Pressable>
              </View>

              {/* photo preview */}
              {photoUri ? (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: photoUri }} style={styles.photo} />
                  <Pressable 
                    style={styles.removePhoto} 
                    onPress={() => setPhotoUri('')}
                  >
                    <Ionicons name="close-circle" size={28} color="#FF3B30" />
                  </Pressable>
                </View>
              ) : null}
            </View>

            {/* save button */}
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t('addReport.save')}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    height: 70,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 15,
  },
  photoSection: {
    marginBottom: 20,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  photoButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  photoButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  photoPreview: {
    marginTop: 15,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  removePhoto: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 14,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});