import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeSection from '../../components/WelcomeSection';
import DashboardCard from '../../components/DashboardCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { useJobs } from '../hooks/useJobs';
import { useCustomers } from '../hooks/useCustomer';

export default function Dashboard() {
  const { t } = useLanguage();
  const { jobs } = useJobs();
  const { customers } = useCustomers();
  const [userName, setUserName] = useState('User');

  // calculate active jobs (not completed)
  const activeJobsCount = jobs.filter(job => job.status !== 'completed').length;
  const totalCustomersCount = customers.length;

  // Load user name when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadUserName();
    }, [])
  );

  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setUserName(name);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const handleCustomersPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/customers');
  };

  const handleAddCustomerPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/addcustomer');
  };

  const handleCreateJobPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/addjob');
  };

  const handleSettingsPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/settings');
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* nav bar */}
        <View style={styles.navbar}>
          <View style={{ width: 80 }} />
          <Text style={styles.navTitle}>{t('dashboard.title')}</Text>
          <View style={{ width: 80, alignItems: 'flex-end' }}>
            <Pressable onPress={handleSettingsPress}>
              <Ionicons name="settings-outline" size={24} color="#007AFF" />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <WelcomeSection userName={userName} />

          {/* grid main cards */}
          <View style={styles.cardsContainer}>
            <View style={styles.cardsRow}>
              <DashboardCard
                title={t('dashboard.activeJobs')}
                number={activeJobsCount.toString()}
              />
              <DashboardCard
                title={t('dashboard.totalCustomers')}
                number={totalCustomersCount.toString()}
                onPress={handleCustomersPress}
              />
            </View>

            {/* quick actions */}
            <Text style={styles.sectionTitle}>{t('dashboard.quickActions')}</Text>
            <View style={styles.cardsRow}>
              <DashboardCard
                iconName="person-add"
                title={t('dashboard.addCustomer')}
                onPress={handleAddCustomerPress}
              />
              <DashboardCard
                iconName="calendar"
                title={t('dashboard.createJob')}
                onPress={handleCreateJobPress}
              />
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
  cardsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
    marginTop: 5,
    marginLeft: 5,
  },
});