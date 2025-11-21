import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar } from '../../components/SearchBar';
import { FilterButton } from '../../components/FilterButton';
import { JobCard } from '../../components/JobCard';
import { EmptyState } from '../../components/EmptyState';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Load jobs from storage when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadJobs();
    }, [])
  );

  const loadJobs = async () => {
    try {
      const data = await AsyncStorage.getItem('jobs');
      const loadedJobs = data ? JSON.parse(data) : [];
      setJobs(loadedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const handleAddPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/addjob');
  };

  const handleJobPress = async (job) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/jobdetails',
      params: {
        jobId: job.id,
        jobTitle: job.title,
        jobDescription: job.description,
        jobCustomerName: job.customerName,
        jobCustomerId: job.customerId,
        jobStatus: job.status,
        jobPriority: job.priority,
        jobScheduledDate: job.scheduledDate,
        jobDueDate: job.dueDate,
        jobLocationAddress: job.location.address,
        jobNotes: job.notes,
      }
    });
  };

  const handleFilterPress = async (filter) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveFilter(filter);
  };

  // Filter and search jobs
  const filteredJobs = jobs.filter(job => {
    // Filter by status
    const matchesFilter = activeFilter === 'all' || job.status === activeFilter;
    
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Nav bar */}
        <View style={styles.navbar}>
          <View style={{ width: 80 }} />
          <Text style={styles.navTitle}>Jobs</Text>
          <View style={{ width: 80, alignItems: 'flex-end' }}>
            <Pressable onPress={handleAddPress}>
              <Ionicons name="add" size={24} color="#007AFF" />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <SearchBar
              placeholder="Search jobs or customers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContent}
            >
              <FilterButton
                label="All"
                active={activeFilter === 'all'}
                onPress={() => handleFilterPress('all')}
              />
              <FilterButton
                label="Scheduled"
                active={activeFilter === 'scheduled'}
                onPress={() => handleFilterPress('scheduled')}
              />
              <FilterButton
                label="In Progress"
                active={activeFilter === 'in-progress'}
                onPress={() => handleFilterPress('in-progress')}
              />
              <FilterButton
                label="Completed"
                active={activeFilter === 'completed'}
                onPress={() => handleFilterPress('completed')}
              />
            </ScrollView>
          </View>

          {/* Jobs List or Empty State */}
          {filteredJobs.length === 0 ? (
            <EmptyState
              icon="briefcase-outline"
              title={jobs.length === 0 ? "No Jobs Yet" : "No Jobs Found"}
              subtitle={
                jobs.length === 0 
                  ? "Tap + to create your first job" 
                  : searchQuery 
                    ? "Try adjusting your search" 
                    : "No jobs match this filter"
              }
            />
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onPress={() => handleJobPress(job)}
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
    marginBottom: 0,
  },
  filterSection: {
    backgroundColor: 'white',
    paddingBottom: 15,
    marginBottom: 15,
  },
  filterContent: {
    paddingHorizontal: 15,
    gap: 8,
  },
  content: {
    flex: 1,
  },
});