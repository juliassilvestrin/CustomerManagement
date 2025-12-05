import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';

function CustomTabBar({ state, descriptors, navigation }) {
  const { t } = useLanguage();
  
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

   
        if (index > 3) return null;

        const iconName = index === 0 ? 'home' : 
                        index === 1 ? 'people-outline' :
                        index === 2 ? 'briefcase-outline' :
                        'bar-chart-outline';

   
        const label = index === 0 ? t('dashboard.title') :
                     index === 1 ? t('customers.title') :
                     index === 2 ? t('jobs.title') :
                     t('reports.title');

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? '#007AFF' : '#8E8E93'}
            />
            <Text style={[
              styles.label,
              { color: isFocused ? '#007AFF' : '#8E8E93' }
            ]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
          }}
        />
        <Tabs.Screen
          name="customers"
          options={{
            title: 'Customers',
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Jobs',
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
          }}
        />
        
        {/* Hidden screens - not in tab bar */}
        <Tabs.Screen name="customerdetails" options={{ href: null }} />
        <Tabs.Screen name="addcustomer" options={{ href: null }} />
        <Tabs.Screen name="addjob" options={{ href: null }} />
        <Tabs.Screen name="editjob" options={{ href: null }} />
        <Tabs.Screen name="jobdetails" options={{ href: null }} />
        <Tabs.Screen name="addreport" options={{ href: null }} />
        <Tabs.Screen name="reportdetails" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
      </Tabs>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    height: 60,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
});