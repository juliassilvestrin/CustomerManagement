import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import WelcomeSection from '../../components/WelcomeSection';
import BottomNavigation from '../../components/BottomNavigation';
import DashboardCard from '../../components/DashboardCard';

export default function Dashboard() {
  const handleCustomersPress = () => {
    router.push('/customers');
  };

  const handleAddCustomerPress = () => {
    // todo
    console.log('Add Customer pressed');
  };

  const handleCreateJobPress = () => {
    //todod
    console.log('Create Job pressed');
  };

  const handleJobsPress = () => {
    //todo
    console.log('Jobs pressed');
  };

  const handleReportsPress = () => {
    // todo
    console.log('Reports pressed');
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* nav bar1 */}
        <View style={styles.navbar}>
          <View />
          <Text style={styles.navTitle}>Dashboard</Text>
          <Ionicons name="notifications-outline" size={24} color="#007AFF" />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <WelcomeSection userName="Julia" />

          {/*cards grid*/}
          <View style={styles.cardsContainer}>
            {/* stats card*/}
            <View style={styles.cardsRow}>
              <DashboardCard
                title="Active Jobs"
                number="24"
              />
              <DashboardCard
                title="Total Customers"
                number="12"
                onPress={handleCustomersPress}
              />
            </View>

            {/* quick actions */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.cardsRow}>
              <DashboardCard
                iconName="person-add"
                title="Add Customer"
                onPress={handleAddCustomerPress}
              />
              <DashboardCard
                iconName="calendar"
                title="Create Job"
                onPress={handleCreateJobPress}
              />
            </View>
          </View>
        </ScrollView>

        {/* bottom nav */}
        <BottomNavigation
          activeTab="dashboard"
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
    paddingBottom: 10,
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