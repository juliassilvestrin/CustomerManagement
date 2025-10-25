import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ReportDetails() {
  const { t, language } = useLanguage();
  const params = useLocalSearchParams();
  
  const report = {
    id: params.reportId,
    title: params.reportTitle || 'Untitled Report',
    description: params.reportDescription || '',
    photoUri: params.reportPhotoUri || '',
    date: params.reportDate || '',
  };

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/reports');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = language === 'pt' ? 'pt-BR' : 'en-US';
    
    return date.toLocaleDateString(locale, { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <Text style={styles.navTitle}>{t('reportDetails.title')}</Text>
          <Ionicons name="document-text-outline" size={24} color="#007AFF" />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* photo */}
          {report.photoUri ? (
            <Image source={{ uri: report.photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.noPhoto}>
              <Ionicons name="image-outline" size={64} color="#d1d5db" />
              <Text style={styles.noPhotoText}>{t('reportDetails.noPhoto')}</Text>
            </View>
          )}

          {/* report info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="document-text" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('reportDetails.titleLabel')}</Text>
                <Text style={styles.infoValue}>{report.title}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('reportDetails.dateLabel')}</Text>
                <Text style={styles.infoValue}>{formatDate(report.date)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="text" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('reportDetails.descriptionLabel')}</Text>
                <Text style={styles.infoValue}>
                  {report.description || t('reportDetails.noDescription')}
                </Text>
              </View>
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
  photo: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8f9fa',
  },
  noPhoto: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPhotoText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    lineHeight: 22,
  },
});