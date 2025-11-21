import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [priority, setPriority] = useState('medium');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [customers, setCustomers] = useState([]);
  
  const [showScheduledPicker, setShowScheduledPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);

  // Load customers when screen loads
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await AsyncStorage.getItem('customers');
      const loadedCustomers = data ? JSON.parse(data) : [];
      setCustomers(loadedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearForm();
    router.back();
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setCustomerId('');
    setCustomerName('');
    setStatus('scheduled');
    setPriority('medium');
    setScheduledDate(new Date());
    setDueDate(new Date());
    setAddress('');
    setNotes('');
  };

  const handleSave = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Validation
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a job title');
      return;
    }

    if (!customerId) {
      Alert.alert('Error', 'Please select a customer');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }

    // Create new job object
    const newJob = {
      id: Date.now(),
      title,
      description,
      customerName,
      customerId: parseInt(customerId),
      status,
      priority,
      scheduledDate: scheduledDate.toISOString(),
      dueDate: dueDate.toISOString(),
      location: {
        address,
      },
      notes,
      createdAt: new Date().toISOString(),
    };

    try {
      // Get existing jobs from storage
      const existingData = await AsyncStorage.getItem('jobs');
      const jobs = existingData ? JSON.parse(existingData) : [];

      // Add new job
      jobs.push(newJob);

      // Save back to storage
      await AsyncStorage.setItem('jobs', JSON.stringify(jobs));

      // Clear form
      clearForm();

      // Go back to jobs list
      router.push('/(tabs)/jobs');
    } catch (error) {
      console.error('Error saving job:', error);
      Alert.alert('Error', 'Failed to save job');
    }
  };

  const onScheduledDateChange = (event, selectedDate) => {
    setShowScheduledPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setScheduledDate(selectedDate);
    }
  };

  const onDueDateChange = (event, selectedDate) => {
    setShowDuePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusLabel = (statusValue) => {
    switch (statusValue) {
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Select status';
    }
  };

  const getPriorityLabel = (priorityValue) => {
    switch (priorityValue) {
      case 'low': return 'Low';
      case 'medium': return 'Medium';
      case 'high': return 'High';
      default: return 'Select priority';
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Nav bar */}
        <View style={styles.navbar}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.navTitle}>Add Job</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Job Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Job Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter job title"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter job description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Customer Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer *</Text>
              <Pressable 
                style={styles.dropdownButton}
                onPress={() => setShowCustomerModal(true)}
              >
                <Text style={[styles.dropdownText, !customerName && styles.placeholderText]}>
                  {customerName || 'Select a customer'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6c757d" />
              </Pressable>
            </View>

            {/* Status Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <Pressable 
                style={styles.dropdownButton}
                onPress={() => setShowStatusModal(true)}
              >
                <Text style={styles.dropdownText}>{getStatusLabel(status)}</Text>
                <Ionicons name="chevron-down" size={20} color="#6c757d" />
              </Pressable>
            </View>

            {/* Priority Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority</Text>
              <Pressable 
                style={styles.dropdownButton}
                onPress={() => setShowPriorityModal(true)}
              >
                <Text style={styles.dropdownText}>{getPriorityLabel(priority)}</Text>
                <Ionicons name="chevron-down" size={20} color="#6c757d" />
              </Pressable>
            </View>

            {/* Scheduled Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Scheduled Date</Text>
              <Pressable 
                style={styles.dateButton}
                onPress={() => setShowScheduledPicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                <Text style={styles.dateText}>{formatDate(scheduledDate)}</Text>
              </Pressable>
              {showScheduledPicker && (
                <DateTimePicker
                  value={scheduledDate}
                  mode="date"
                  display="default"
                  onChange={onScheduledDateChange}
                />
              )}
            </View>

            {/* Due Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Due Date</Text>
              <Pressable 
                style={styles.dateButton}
                onPress={() => setShowDuePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                <Text style={styles.dateText}>{formatDate(dueDate)}</Text>
              </Pressable>
              {showDuePicker && (
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="default"
                  onChange={onDueDateChange}
                />
              )}
            </View>

            {/* Location/Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter job address"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Additional notes"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Save Button */}
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Job</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Customer Modal */}
        <Modal
          visible={showCustomerModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCustomerModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Customer</Text>
                <Pressable onPress={() => setShowCustomerModal(false)}>
                  <Ionicons name="close" size={24} color="#1a1a1a" />
                </Pressable>
              </View>
              <ScrollView>
                {customers.map((customer) => (
                  <Pressable
                    key={customer.id}
                    style={styles.modalOption}
                    onPress={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setCustomerId(customer.id.toString());
                      setCustomerName(customer.name);
                      setShowCustomerModal(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{customer.name}</Text>
                    {customerId === customer.id.toString() && (
                      <Ionicons name="checkmark" size={24} color="#007AFF" />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Status Modal */}
        <Modal
          visible={showStatusModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowStatusModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Status</Text>
                <Pressable onPress={() => setShowStatusModal(false)}>
                  <Ionicons name="close" size={24} color="#1a1a1a" />
                </Pressable>
              </View>
              <Pressable
                style={styles.modalOption}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setStatus('scheduled');
                  setShowStatusModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>Scheduled</Text>
                {status === 'scheduled' && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </Pressable>
              <Pressable
                style={styles.modalOption}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setStatus('in-progress');
                  setShowStatusModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>In Progress</Text>
                {status === 'in-progress' && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </Pressable>
              <Pressable
                style={styles.modalOption}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setStatus('completed');
                  setShowStatusModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>Completed</Text>
                {status === 'completed' && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Priority Modal */}
        <Modal
          visible={showPriorityModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPriorityModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Priority</Text>
                <Pressable onPress={() => setShowPriorityModal(false)}>
                  <Ionicons name="close" size={24} color="#1a1a1a" />
                </Pressable>
              </View>
              <Pressable
                style={styles.modalOption}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPriority('low');
                  setShowPriorityModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>Low</Text>
                {priority === 'low' && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </Pressable>
              <Pressable
                style={styles.modalOption}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPriority('medium');
                  setShowPriorityModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>Medium</Text>
                {priority === 'medium' && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </Pressable>
              <Pressable
                style={styles.modalOption}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPriority('high');
                  setShowPriorityModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>High</Text>
                {priority === 'high' && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </Pressable>
            </View>
          </View>
        </Modal>
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
  dropdownButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  placeholderText: {
    color: '#6c757d',
  },
  dateButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#1a1a1a',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
});