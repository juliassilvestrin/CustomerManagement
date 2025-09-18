import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavItem from './NavItem';

interface BottomNavigationProps {
  activeTab: 'dashboard' | 'customers' | 'jobs' | 'reports';
  onCustomersPress: () => void;
  onJobsPress: () => void;
  onReportsPress: () => void;
  onDashboardPress?: () => void;
}

export default function BottomNavigation({ 
  activeTab, 
  onCustomersPress, 
  onJobsPress, 
  onReportsPress,
  onDashboardPress 
}: BottomNavigationProps) {
  return (
    <View style={styles.bottomNav}>
      <NavItem
        iconName="home"
        label="Dashboard"
        isActive={activeTab === 'dashboard'}
        onPress={onDashboardPress}
      />
      
      <NavItem
        iconName="people-outline"
        label="Customers"
        isActive={activeTab === 'customers'}
        onPress={onCustomersPress}
      />
      
      <NavItem
        iconName="briefcase-outline"
        label="Jobs"
        isActive={activeTab === 'jobs'}
        isDisabled={true}
        onPress={() => console.log('Jobs coming soon')}
      />
      
      <NavItem
        iconName="bar-chart-outline"
        label="Reports"
        isActive={activeTab === 'reports'}
        isDisabled={true}
        onPress={() => console.log('Reports coming soon')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 5,
    paddingBottom: 10, 
    paddingHorizontal: 10,
  },
});