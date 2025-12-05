import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useJobs } from '../hooks/useJobs';
import { useLanguage } from '../../contexts/LanguageContext';
import { MapCard } from '../../components/MapCard';

export default function CustomerDetails() {
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const { jobs } = useJobs();
  
  const customer = {
    id: params.customerId,
    name: params.customerName || 'Unknown Customer',
    email: params.customerEmail || '',
    phone: params.customerPhone || '',
    address: params.customerAddress || '',
    contactPerson: params.customerContactPerson || 'N/A',
  };

  // get all jobs for this customer
  const customerJobs = jobs.filter(job => job.customerId === parseInt(customer.id));

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/customers');  
  };

  const handleCallPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (customer.phone) {
      Linking.openURL(`tel:${customer.phone}`);
    }
  };

  const handleEmailPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (customer.email) {
      Linking.openURL(`mailto:${customer.email}`);
    }
  };

  const handleJobPress = async (job) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/(tabs)/jobdetails',  
      params: {
        jobId: job.id,
        jobTitle: job.title,
        jobDescription: job.description,
        jobCustomerName: job.customerName,
        jobCustomerId: job.customerId,
        jobStatus: job.status,
        jobPriority: job.priority,
        jobScheduledDate: job.scheduledDate,
        jobDueDate: job.dueDate,
        jobLocationAddress: job.location.address,
        jobNotes: job.notes,
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return { bg: '#e3f2fd', text: '#1976d2' };
      case 'in-progress': return { bg: '#fff3e0', text: '#f57c00' };
      case 'completed': return { bg: '#e8f5e9', text: '#388e3c' };
      default: return { bg: '#f0f0f0', text: '#6c757d' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'scheduled': return t('status.scheduled');
      case 'in-progress': return t('status.inProgress');
      case 'completed': return t('status.completed');
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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

            {customer.address && (
              <>
                <View style={[styles.infoRow, styles.infoRowNoBorder]}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="location" size={20} color="#007AFF" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{t('customerDetails.address')}</Text>
                    <Text style={styles.infoValue}>{customer.address}</Text>
                  </View>
                </View>
                
                {/* MAP COMPONENT */}
                <MapCard 
                  address={customer.address}
                  title={customer.name}
                  buttonText={t('customerDetails.getDirections')}
                />
              </>
            )}

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
                <Text style={styles.infoValue}>{customerJobs.length} jobs</Text>
              </View>
            </View>
          </View>

          {/* jobs section */}
          {customerJobs.length > 0 && (
            <View style={styles.jobsSection}>
              <Text style={styles.sectionTitle}>{t('customerDetails.jobsForCustomer')}</Text>
              {customerJobs.map((job) => {
                const statusColors = getStatusColor(job.status);
                return (
                  <Pressable 
                    key={job.id} 
                    style={styles.jobCard}
                    onPress={() => handleJobPress(job)}
                  >
                    <View style={styles.jobHeader}>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                        <Text style={[styles.statusText, { color: statusColors.text }]}>
                          {getStatusLabel(job.status)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.jobDetails}>
                      <View style={styles.jobDetailRow}>
                        <Ionicons name="calendar-outline" size={14} color="#6c757d" />
                        <Text style={styles.jobDetailText}>{formatDate(job.scheduledDate)}</Text>
                      </View>
                      <View style={styles.jobDetailRow}>
                        <Ionicons name="location-outline" size={14} color="#6c757d" />
                        <Text style={styles.jobDetailText}>{job.location.address}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
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
  infoRowNoBorder: {
    borderBottomWidth: 0,
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
  jobsSection: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jobDetails: {
    gap: 5,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobDetailText: {
    fontSize: 14,
    color: '#6c757d',
  },
});