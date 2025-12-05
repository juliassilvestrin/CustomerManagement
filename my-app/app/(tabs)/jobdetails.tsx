import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useJobs } from '../hooks/useJobs';
import { MapCard } from '../../components/MapCard';

export default function JobDetails() {
  const params = useLocalSearchParams();
  const { deleteJob } = useJobs();
  
  const job = {
    id: params.jobId,
    title: params.jobTitle || 'Unknown Job',
    description: params.jobDescription || '',
    customerName: params.jobCustomerName || '',
    customerId: params.jobCustomerId || '',
    status: params.jobStatus || 'scheduled',
    priority: params.jobPriority || 'medium',
    scheduledDate: params.jobScheduledDate || '',
    dueDate: params.jobDueDate || '',
    locationAddress: params.jobLocationAddress || '',
    notes: params.jobNotes || '',
  };

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/jobs');  
  };

  const handleEditPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/(tabs)/editjob',  
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
        jobLocationAddress: job.locationAddress,
        jobNotes: job.notes,
      }
    });
  };

  const handleDeletePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteJob(job.id);
            
            if (success) {
              router.push('/(tabs)/jobs');  
            } else {
              Alert.alert('Error', 'Failed to delete job');
            }
          },
        },
      ]
    );
  };

  const handleCustomerPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // navigate to customer details
    console.log('Navigate to customer:', job.customerId);
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
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#fd7e14';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return priority;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const statusColors = getStatusColor(job.status);

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* nav bar */}
        <View style={styles.navbar}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.navTitle}>Job Details</Text>
          <Pressable onPress={handleEditPress}>
            <Ionicons name="create-outline" size={24} color="#007AFF" />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* job header */}
          <View style={styles.headerSection}>
            <View style={styles.jobIcon}>
              <Ionicons name="briefcase" size={48} color="#007AFF" />
            </View>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {getStatusLabel(job.status)}
              </Text>
            </View>
          </View>

          {/* job info */}
          <View style={styles.infoSection}>
            {/* customer */}
            <Pressable style={styles.infoRow} onPress={handleCustomerPress}>
              <View style={styles.infoIcon}>
                <Ionicons name="person" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Customer</Text>
                <Text style={styles.linkText}>{job.customerName}</Text>
              </View>
            </Pressable>

            {/* priority */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="flag" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Priority</Text>
                <Text style={[styles.infoValue, { color: getPriorityColor(job.priority) }]}>
                  {getPriorityLabel(job.priority)}
                </Text>
              </View>
            </View>

            {/* scheduled date */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Scheduled Date</Text>
                <Text style={styles.infoValue}>{formatDate(job.scheduledDate)}</Text>
              </View>
            </View>

            {/* due date */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Due Date</Text>
                <Text style={styles.infoValue}>{formatDate(job.dueDate)}</Text>
              </View>
            </View>

            {/* location */}
            {job.locationAddress && (
              <>
                <View style={[styles.infoRow, styles.infoRowNoBorder]}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="location" size={20} color="#007AFF" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{job.locationAddress}</Text>
                  </View>
                </View>

                {/* MAP COMPONENT */}
                <MapCard 
                  address={job.locationAddress}
                  title={job.title}
                  buttonText="Get Directions"
                />
              </>
            )}

            {/* description */}
            {job.description ? (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="document-text" size={20} color="#007AFF" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{job.description}</Text>
                </View>
              </View>
            ) : null}

            {/* notes */}
            {job.notes ? (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="clipboard" size={20} color="#007AFF" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Notes</Text>
                  <Text style={styles.infoValue}>{job.notes}</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* delete button */}
          <Pressable style={styles.deleteButton} onPress={handleDeletePress}>
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.deleteButtonText}>Delete Job</Text>
          </Pressable>
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
  jobIcon: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
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
    alignItems: 'flex-start',
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
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
deleteButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FF3B30',  
  marginHorizontal: 15,
  marginVertical: 20,
  paddingVertical: 16,
  paddingHorizontal: 20,
  minHeight: 44,  
  borderRadius: 12,
  gap: 8,
},
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});