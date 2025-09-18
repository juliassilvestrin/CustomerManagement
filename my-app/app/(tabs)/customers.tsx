import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

const hardcodedCustomers = [
  { id: 1, name: 'ABC Construction Co.', email: 'contact@abcconstruction.com', phone: '(555) 123-4567', jobs: 3 },
  { id: 2, name: 'Smith Property Mgmt', email: 'info@smithproperty.com', phone: '(555) 987-6543', jobs: 1 },
  { id: 3, name: 'Downtown Retail LLC', email: 'manager@downtownretail.com', phone: '(555) 456-7890', jobs: 2 },
];

export default function Customers() {
  const [searchText, setSearchText] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(hardcodedCustomers);

  useEffect(() => {
    const filtered = hardcodedCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchText]);

  const handleCustomerPress = (customer) => {
    router.push({
      pathname: '/customerdetails',
      params: { 
        customerId: customer.id, 
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerJobs: customer.jobs
      }
    });
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

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.navTitle}>Customers</Text>
          <Ionicons name="add" size={24} color="#007AFF" />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#6c757d" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search customers..."
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>

          {filteredCustomers.map((customer) => (
            <Pressable 
              key={customer.id} 
              style={styles.customerCard}
              onPress={() => handleCustomerPress(customer)}
            >
              <View style={styles.customerHeader}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.jobCount}>{customer.jobs} jobs</Text>
              </View>
              <Text style={styles.customerInfo}>{customer.email}</Text>
              <Text style={styles.customerInfo}>{customer.phone}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* bottom nav  */}
        <BottomNavigation
          activeTab="customers"
          onDashboardPress={handleDashboardPress}
          onCustomersPress={() => {}}
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
    height: 70,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  customerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  jobCount: {
    color: '#007AFF',
    fontWeight: '500',
  },
  customerInfo: {
    color: '#6c757d',
    fontSize: 14,
    marginBottom: 2,
  },
});