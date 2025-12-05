import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert, Platform, Modal, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useJobs } from '../hooks/useJobs';
import { useCustomers } from '../hooks/useCustomer';

export default function AddJob() {
  const { addJob } = useJobs();
  const { customers, loadCustomers } = useCustomers();
  const scrollViewRef = useRef(null);
  
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
  
  const [showScheduledPicker, setShowScheduledPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);

  // load customers when screen loads
  useEffect(() => {
    loadCustomers();
  }, []);

  // reset scroll position when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    clearForm();
    router.push('/(tabs)/jobs');
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
    Keyboard.dismiss();

    // validation
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

    // create new job
    const newJob = {
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

    const savedJob = await addJob(newJob);
    
    if (savedJob) {
      clearForm();
      router.push('/(tabs)/jobs');
    } else {
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
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* nav bar */}
        <View style={styles.navbar}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.navTitle}>Add Job</Text>
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
            {/* job title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Job Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter job title"
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
              />
            </View>

            {/* description */}
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

            {/* customer picker */}
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

            {/* status picker */}
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

            {/* priority picker */}
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

            {/* scheduled date */}
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

            {/* due date */}
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

            {/* location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter job address"
                value={address}
                onChangeText={setAddress}
                returnKeyType="next"
              />
            </View>

            {/* notes */}
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
                returnKeyType="done"
                onSubmitEditing={handleSave}
                onFocus={() => {
                  
                  setTimeout(() => {
                    scrollViewRef.current?.scrollTo({ y: 1000, animated: true });
                  }, 100);
                }}
              />
            </View>

            {/* save button */}
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Job</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* customer modal */}
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

        {/* status modal */}
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

        {/* priority modal */}
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
    paddingBottom: 300,
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