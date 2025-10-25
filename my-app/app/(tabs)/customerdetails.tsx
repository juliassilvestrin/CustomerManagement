import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CustomerDetails() {
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  
  const customer = {
    id: params.customerId,
    name: params.customerName || 'Unknown Customer',
    email: params.customerEmail || '',
    phone: params.customerPhone || '',
    jobs: params.customerJobs || 0,
    contactPerson: params.customerContactPerson || 'N/A',
  };

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/customers');
  };

  const handleCallPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Call customer:', customer.phone);
  };

  const handleEmailPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Email customer:', customer.email);
  };

  const handleViewLocationPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('View location');
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
          <Text style={styles.navTitle}>{t('customerDetails.title')}</Text>
          <Ionicons name="person-circle-outline" size={24} color="#007AFF" />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* customer header */}
          <View style={styles.headerSection}>
            <View style={styles.customerIcon}>
              <Ionicons name="business" size={48} color="#007AFF" />
            </View>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerType}>{t('customerDetails.commercial')}</Text>
          </View>

          {/* contact info */}
          <View style={styles.infoSection}>
            <Pressable style={styles.infoRow} onPress={handleEmailPress}>
              <View style={styles.infoIcon}>
                <Ionicons name="mail" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('customerDetails.email')}</Text>
                <Text style={styles.infoValue}>{customer.email}</Text>
              </View>
            </Pressable>

            <Pressable style={styles.infoRow} onPress={handleCallPress}>
              <View style={styles.infoIcon}>
                <Ionicons name="call" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('customerDetails.phone')}</Text>
                <Text style={styles.infoValue}>{customer.phone}</Text>
              </View>
            </Pressable>

            <Pressable style={styles.infoRow} onPress={handleViewLocationPress}>
              <View style={styles.infoIcon}>
                <Ionicons name="location" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('customerDetails.address')}</Text>
                <Pressable onPress={handleViewLocationPress}>
                  <Text style={styles.linkText}>{t('customerDetails.viewLocation')}</Text>
                </Pressable>
              </View>
            </Pressable>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('customerDetails.contactPerson')}</Text>
                <Text style={styles.infoValue}>{customer.contactPerson}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="briefcase" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('customerDetails.activeJobs')}</Text>
                <Text style={styles.infoValue}>{customer.jobs} {t('customers.jobs')}</Text>
              </View>
            </View>
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
  headerSection: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  customerIcon: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  customerName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  customerType: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});