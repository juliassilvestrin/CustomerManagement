import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../contexts/LanguageContext';
import { useJobs } from '../hooks/useJobs';
import { useCustomers } from '../hooks/useCustomer';
import { useReports } from '../hooks/useReports';

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { jobs } = useJobs();
  const { customers } = useCustomers();
  const { reports } = useReports();

  const [userName, setUserName] = useState('User');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('User');

  // load user name from storage
  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setUserName(name);
        setTempName(name);
      }
    } catch (error) {
      console.error('error loading user name:', error);
    }
  };

  const saveUserName = async () => {
    try {
      await AsyncStorage.setItem('userName', tempName);
      setUserName(tempName);
      setEditingName(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('error saving user name:', error);
      Alert.alert(t('common.error'), t('settings.errorSavingName'));
    }
  };

  const handleLanguageToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  const handleClearAllData = () => {
    Alert.alert(
      t('settings.clearAllData'),
      t('settings.clearDataConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['customers', 'jobs', 'reports']);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert(t('common.success'), t('settings.clearDataSuccess'));
            } catch (error) {
              console.error('error clearing data:', error);
              Alert.alert(t('common.error'), t('settings.errorClearingData'));
            }
          },
        },
      ]
    );
  };

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* nav bar */}
        <View style={styles.navbar}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.navTitle}>{t('settings.title')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* user profile section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.profile')}</Text>
            <View style={styles.settingCard}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.profileInfo}>
                  {editingName ? (
                    <View style={styles.nameEditContainer}>
                      <TextInput
                        style={styles.nameInput}
                        value={tempName}
                        onChangeText={setTempName}
                        autoFocus
                      />
                      <View style={styles.nameEditButtons}>
                        <Pressable 
                          style={styles.nameEditButton}
                          onPress={() => {
                            setTempName(userName);
                            setEditingName(false);
                          }}
                        >
                          <Ionicons name="close" size={20} color="#FF3B30" />
                        </Pressable>
                        <Pressable 
                          style={styles.nameEditButton}
                          onPress={saveUserName}
                        >
                          <Ionicons name="checkmark" size={20} color="#34C759" />
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.nameDisplayContainer}>
                      <Text style={styles.userName}>{userName}</Text>
                      <Pressable onPress={() => setEditingName(true)}>
                        <Ionicons name="pencil" size={20} color="#007AFF" />
                      </Pressable>
                    </View>
                  )}
                  <Text style={styles.userRole}>{t('settings.businessOwner')}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* language section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
            <View style={styles.settingCard}>
              <Pressable 
                style={styles.languageOption}
                onPress={handleLanguageToggle}
              >
                <View style={styles.languageInfo}>
                  <Ionicons name="language" size={24} color="#007AFF" />
                  <Text style={styles.languageText}>
                    {language === 'en' ? t('settings.english') : t('settings.portuguese')}
                  </Text>
                </View>
                <Text style={styles.languageSwitch}>EN / PT</Text>
              </Pressable>
            </View>
          </View>

          {/* data management section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.dataManagement')}</Text>
            <View style={styles.settingCard}>
              <View style={styles.dataRow}>
                <Ionicons name="people" size={20} color="#007AFF" />
                <Text style={styles.dataLabel}>{t('settings.totalCustomers')}</Text>
                <Text style={styles.dataValue}>{customers.length}</Text>
              </View>
              <View style={styles.dataRow}>
                <Ionicons name="briefcase" size={20} color="#007AFF" />
                <Text style={styles.dataLabel}>{t('settings.totalJobs')}</Text>
                <Text style={styles.dataValue}>{jobs.length}</Text>
              </View>
              <View style={styles.dataRow}>
                <Ionicons name="document-text" size={20} color="#007AFF" />
                <Text style={styles.dataLabel}>{t('settings.totalReports')}</Text>
                <Text style={styles.dataValue}>{reports.length}</Text>
              </View>
            </View>

            <Pressable style={styles.clearButton} onPress={handleClearAllData}>
              <Ionicons name="trash-outline" size={20} color="white" />
              <Text style={styles.clearButtonText}>{t('settings.clearAllData')}</Text>
            </Pressable>
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
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
    marginLeft: 5,
  },
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  nameDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  userRole: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nameInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingVertical: 4,
  },
  nameEditButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  nameEditButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  languageSwitch: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dataLabel: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 12,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    gap: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});