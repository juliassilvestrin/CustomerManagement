import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOMERS_KEY = 'customers';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //load customers from async
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(CUSTOMERS_KEY);
      const loadedCustomers = data ? JSON.parse(data) : [];
      setCustomers(loadedCustomers);
      setError(null);
    } catch (err) {
      console.error('Error loading customers:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  //add customer
  const addCustomer = useCallback(async (newCustomer) => {
    try {
      const data = await AsyncStorage.getItem(CUSTOMERS_KEY);
      const currentCustomers = data ? JSON.parse(data) : [];
      const customerWithId = { ...newCustomer, id: Date.now() };
      const updatedCustomers = [...currentCustomers, customerWithId];
      await AsyncStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updatedCustomers));
      setCustomers(updatedCustomers);
      setError(null);
      return customerWithId;
    } catch (err) {
      console.error('Error adding customer:', err);
      setError(err);
      return null;
    }
  }, []);

  //update customer
  const updateCustomer = useCallback(async (customerId, updatedCustomer) => {
    try {
      const data = await AsyncStorage.getItem(CUSTOMERS_KEY);
      const currentCustomers = data ? JSON.parse(data) : [];
      const customerIndex = currentCustomers.findIndex(c => c.id.toString() === customerId.toString());
      
      if (customerIndex !== -1) {
        currentCustomers[customerIndex] = { ...updatedCustomer, id: customerId };
        await AsyncStorage.setItem(CUSTOMERS_KEY, JSON.stringify(currentCustomers));
        setCustomers(currentCustomers);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating customer:', err);
      setError(err);
      return false;
    }
  }, []);

  //delete customer
  const deleteCustomer = useCallback(async (customerId) => {
    try {
      const data = await AsyncStorage.getItem(CUSTOMERS_KEY);
      const currentCustomers = data ? JSON.parse(data) : [];
      const filteredCustomers = currentCustomers.filter(c => c.id.toString() !== customerId.toString());
      await AsyncStorage.setItem(CUSTOMERS_KEY, JSON.stringify(filteredCustomers));
      setCustomers(filteredCustomers);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError(err);
      return false;
    }
  }, []);

  //get customer by id
  const getCustomerById = useCallback((customerId) => {
    return customers.find(c => c.id.toString() === customerId.toString()) || null;
  }, [customers]);

  //load customers
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    customers,
    loading,
    error,
    loadCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
  };
};