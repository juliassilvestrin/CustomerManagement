import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../../contexts/LanguageContext';
import { EmptyState } from '../../components/EmptyState';
import { useReports } from './../hooks/useReports';

export default function Reports() {
  const { t, language } = useLanguage();
  const { reports, loadReports } = useReports();

  // load reports from storage when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const handleAddPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/addreport');
  };

  const handleReportPress = async (report) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/reportdetails',
      params: {
        reportId: report.id,
        reportTitle: report.title,
        reportDescription: report.description,
        reportPhotoUri: report.photoUri,
        reportDate: report.date,
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = language === 'pt' ? 'pt-BR' : 'en-US';
    
    return date.toLocaleDateString(locale, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* nav bar */}
        <View style={styles.navbar}>
          <View style={{ width: 80 }} />
          <Text style={styles.navTitle}>{t('reports.title')}</Text>
          <View style={{ width: 80, alignItems: 'flex-end' }}>
            <Pressable onPress={handleAddPress}>
              <Ionicons name="add" size={24} color="#007AFF" />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {reports.length === 0 ? (
            <EmptyState
              icon="document-text-outline"
              title={t('reports.empty')}
              subtitle={t('reports.emptyDesc')}
            />
          ) : (
            reports.map((report) => (
              <Pressable 
                key={report.id} 
                style={styles.reportCard}
                onPress={() => handleReportPress(report)}
              >
                {report.photoUri ? (
                  <Image source={{ uri: report.photoUri }} style={styles.reportImage} />
                ) : (
                  <View style={styles.noImage}>
                    <Ionicons name="image-outline" size={40} color="#d1d5db" />
                  </View>
                )}
                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportDescription} numberOfLines={2}>
                    {report.description}
                  </Text>
                  <Text style={styles.reportDate}>{formatDate(report.date)}</Text>
                </View>
              </Pressable>
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
  content: {
    flex: 1,
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  reportImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f8f9fa',
  },
  noImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportInfo: {
    padding: 15,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  reportDate: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
});