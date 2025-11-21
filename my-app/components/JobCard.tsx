import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import * as Haptics from 'expo-haptics';

interface Job {
  id: number;
  title: string;
  customerName: string;
  status: string;
  priority: string;
  dueDate: string;
  location: {
    address: string;
  };
}

interface JobCardProps {
  job: Job;
  onPress: () => void;
}

export const JobCard = ({ job, onPress }: JobCardProps) => {
  const { t } = useLanguage();
  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return { bg: '#e3f2fd', text: '#1976d2' };
      case 'in-progress': return { bg: '#fff3e0', text: '#f57c00' };
      case 'completed': return { bg: '#e8f5e9', text: '#388e3c' };
      default: return { bg: '#f0f0f0', text: '#6c757d' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return t('jobs.scheduled');
      case 'in-progress': return t('jobs.inProgress');
      case 'completed': return t('jobs.completed');
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#fd7e14';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return t('jobs.highPriority');
      case 'medium': return t('jobs.mediumPriority');
      case 'low': return t('jobs.lowPriority');
      default: return priority;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const statusColors = getStatusColor(job.status);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View style={[styles.jobCard, { transform: [{ scale }] }]}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
          <View style={[styles.jobStatus, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.jobStatusText, { color: statusColors.text }]}>
              {getStatusLabel(job.status)}
            </Text>
          </View>
        </View>

        <View style={styles.jobInfo}>
          <View style={styles.jobInfoRow}>
            <Ionicons name="person" size={14} color="#6c757d" />
            <Text style={styles.jobInfoText} numberOfLines={1}>{job.customerName}</Text>
          </View>
          <View style={styles.jobInfoRow}>
            <Ionicons name="calendar" size={14} color="#6c757d" />
            <Text style={styles.jobInfoText}>
              {job.status === 'completed' ? 'Completed' : 'Due'}: {formatDate(job.dueDate)}
            </Text>
          </View>
          <View style={styles.jobInfoRow}>
            <Ionicons name="location" size={14} color="#6c757d" />
            <Text style={styles.jobInfoText} numberOfLines={1}>{job.location.address}</Text>
          </View>
        </View>

        <View style={styles.jobMeta}>
          <Text style={[styles.priorityText, { color: getPriorityColor(job.priority) }]}>
            {getPriorityLabel(job.priority)}
          </Text>
          <Text style={styles.daysText}>
            {job.status === 'completed' ? '✓ Completed' : getDaysUntil(job.dueDate)}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 44, // HIG: minimum touch target
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 10,
  },
  jobStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  jobStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobInfo: {
    marginBottom: 10,
  },
  jobInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  jobInfoText: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 6,
    flex: 1,
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  daysText: {
    fontSize: 13,
    color: '#6c757d',
  },
});