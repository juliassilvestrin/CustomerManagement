import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFocusEffect } from '@react-navigation/native';
import { CustomerCard } from '../../components/CustomerCard';

export default function Customers() {
  const { t } = useLanguage();
  const [searchText, setSearchText] = useState('');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // load customers from storage when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadCustomers();
    }, [])
  );

  const loadCustomers = async () => {
    try {
      const data = await AsyncStorage.getItem('customers');
      const loadedCustomers = data ? JSON.parse(data) : [];
      setCustomers(loadedCustomers);
      setFilteredCustomers(loadedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  // filter customers when search text changes
  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchText, customers]);

  const handleCustomerPress = async (customer) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/customerdetails',
      params: { 
        customerId: customer.id, 
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerJobs: customer.jobs,
        customerContactPerson: customer.contactPerson,
      }
    });
  };

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleAddPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/addcustomer');
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.navTitle}>{t('customers.title')}</Text>
          <Pressable onPress={handleAddPress}>
            <Ionicons name="add" size={24} color="#007AFF" />
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#6c757d" />
              <TextInput
                style={styles.searchInput}
                placeholder={t('customers.search')}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>

          {filteredCustomers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>{t('customers.empty')}</Text>
              <Text style={styles.emptySubtitle}>{t('customers.emptyDesc')}</Text>
            </View>
          ) : (
            filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onPress={() => handleCustomerPress(customer)}
              />
            ))
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});