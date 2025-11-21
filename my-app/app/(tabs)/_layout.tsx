import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LanguageProvider } from '../../contexts/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e9ecef',
            height: 60,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="customers"
          options={{
            title: 'Customers',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Jobs',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="briefcase-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="customerdetails"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="addcustomer"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="addreport"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="reportdetails"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </LanguageProvider>
  );
}