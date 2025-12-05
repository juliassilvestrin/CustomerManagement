import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCustomers } from '../hooks/useCustomer';

export default function AddCustomer() {
  const { t } = useLanguage();
  const { addCustomer } = useCustomers();
  const scrollViewRef = useRef(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    clearForm();
    router.push('/(tabs)/customers');  
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setContactPerson('');
  };

  const handleSave = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();

    // create new customer object
    const newCustomer = {
      name,
      email,
      phone,
      address,
      contactPerson,
      jobs: 0,
    };

    console.log('Saving customer:', newCustomer);

    const savedCustomer = await addCustomer(newCustomer);
    
    if (savedCustomer) {
      console.log('Customer saved:', savedCustomer);
      clearForm();
      router.push('/(tabs)/customers');
    } else {
      Alert.alert('Error', 'Failed to save customer');
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* nav bar */}
        <View style={styles.navbar}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.navTitle}>{t('addCustomer.title')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.form}>
            {/* customer name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('addCustomer.name')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('addCustomer.name')}
                value={name}
                onChangeText={setName}
                returnKeyType="next"
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
                returnKeyType="next"
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
                returnKeyType="next"
              />
            </View>

            {/* address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('addCustomer.address')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('addCustomer.address')}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                returnKeyType="next"
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
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
            </View>

            {/* save button */}
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t('addCustomer.save')}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: 20,
    paddingBottom: 100,
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
    minHeight: 80,
    paddingTop: 15,
  },
 saveButton: {
  backgroundColor: '#007AFF',
  borderRadius: 12,
  paddingVertical: 16,
  paddingHorizontal: 20,
  minHeight: 44,
  alignItems: 'center',
  justifyContent: 'center',  
  marginTop: 20,
  marginBottom: 20,
},
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});