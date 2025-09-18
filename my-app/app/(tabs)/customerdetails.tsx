import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

export default function CustomerDetails() {
  const params = useLocalSearchParams();
  
  const customer = {
    id: params.customerId,
    name: params.customerName || 'Unknown Customer',
    email: params.customerEmail || '',
    phone: params.customerPhone || '',
    jobs: params.customerJobs || 0,
  };

  const handleCustomersPress = () => {
    router.push('/customers');
  };

  const handleDashboardPress = () => {
    router.push('/');
  };

  const handleJobsPress = () => {
    console.log('Jobs pressed');
  };

  const handleReportsPress = () => {
    console.log('Reports pressed');
  };

  const handleCallPress = () => {
    console.log('Call customer:', customer.phone);
  };

  const handleEmailPress = () => {
    console.log('Email customer:', customer.email);
  };

  const handleViewLocationPress = () => {
    console.log('View location');
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Navigation Bar */}
        <View style={styles.navbar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.navTitle}>Customer Details</Text>
          <Ionicons name="person-circle-outline" size={24} color="#007AFF" />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Customer Header */}
          <View style={styles.headerSection}>
            <View style={styles.customerIcon}>
              <Ionicons name="business" size={48} color="#007AFF" />
            </View>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerType}>Commercial Client</Text>
          </View>

          {/* Contact Information */}
          <View style={styles.infoSection}>
            {/* Email */}
            <Pressable style={styles.infoRow} onPress={handleEmailPress}>
              <View style={styles.infoIcon}>
                <Ionicons name="mail" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{customer.email}</Text>
              </View>
            </Pressable>

            {/* Phone */}
            <Pressable style={styles.infoRow} onPress={handleCallPress}>
              <View style={styles.infoIcon}>
                <Ionicons name="call" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{customer.phone}</Text>
              </View>
            </Pressable>

            {/* Address */}
            <Pressable style={styles.infoRow} onPress={handleViewLocationPress}>
              <View style={styles.infoIcon}>
                <Ionicons name="location" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Pressable onPress={handleViewLocationPress}>
                  <Text style={styles.linkText}>View Location</Text>
                </Pressable>
              </View>
            </Pressable>

            {/* Contact Person */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Contact Person</Text>
                <Text style={styles.infoValue}>John Smith</Text>
              </View>
            </View>

            {/* Active Jobs */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="briefcase" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Active Jobs</Text>
                <Text style={styles.infoValue}>{customer.jobs} jobs</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Tab Navigation */}
        <BottomNavigation
          activeTab="customers"
          onDashboardPress={handleDashboardPress}
          onCustomersPress={handleCustomersPress}
          onJobsPress={handleJobsPress}
          onReportsPress={handleReportsPress}
        />
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