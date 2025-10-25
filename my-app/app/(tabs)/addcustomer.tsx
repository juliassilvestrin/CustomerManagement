import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AddCustomer() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // clear form when going back
    clearForm();
    router.back();
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setContactPerson('');
  };

  const handleSave = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // create new customer object
    const newCustomer = {
      id: Date.now(),
      name,
      email,
      phone,
      contactPerson,
      jobs: 0,
    };

    try {
      // get existing customers from storage
      const existingData = await AsyncStorage.getItem('customers');
      const customers = existingData ? JSON.parse(existingData) : [];

      // add new customer
      customers.push(newCustomer);

      // save back to storage
      await AsyncStorage.setItem('customers', JSON.stringify(customers));

      // clear form
      clearForm();

      // go back to customers list
      router.push('/(tabs)/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
      Alert.alert('Error', 'Failed to save customer');
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
          <Text style={styles.navTitle}>{t('addCustomer.title')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* customer name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('addCustomer.name')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('addCustomer.name')}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('addCustomer.email')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('addCustomer.email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('addCustomer.phone')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('addCustomer.phone')}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* contact person */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('addCustomer.contactPerson')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('addCustomer.contactPerson')}
                value={contactPerson}
                onChangeText={setContactPerson}
              />
            </View>

            {/* save button */}
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t('addCustomer.save')}</Text>
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