import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JOBS_KEY = 'jobs';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //load jobs from async
  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(JOBS_KEY);
      const loadedJobs = data ? JSON.parse(data) : [];
      setJobs(loadedJobs);
      setError(null);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  //add job
  const addJob = useCallback(async (newJob) => {
    try {
      const data = await AsyncStorage.getItem(JOBS_KEY);
      const currentJobs = data ? JSON.parse(data) : [];
      const jobWithId = { ...newJob, id: Date.now() };
      const updatedJobs = [...currentJobs, jobWithId];
      await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(updatedJobs));
      setJobs(updatedJobs);
      setError(null);
      return jobWithId;
    } catch (err) {
      console.error('Error adding job:', err);
      setError(err);
      return null;
    }
  }, []);

  //update job
  const updateJob = useCallback(async (jobId, updatedJob) => {
    try {
      const data = await AsyncStorage.getItem(JOBS_KEY);
      const currentJobs = data ? JSON.parse(data) : [];
      const jobIndex = currentJobs.findIndex(j => j.id.toString() === jobId.toString());
      
      if (jobIndex !== -1) {
        currentJobs[jobIndex] = { ...updatedJob, id: jobId };
        await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(currentJobs));
        setJobs(currentJobs);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating job:', err);
      setError(err);
      return false;
    }
  }, []);

  //delete job
  const deleteJob = useCallback(async (jobId) => {
    try {
      const data = await AsyncStorage.getItem(JOBS_KEY);
      const currentJobs = data ? JSON.parse(data) : [];
      const filteredJobs = currentJobs.filter(j => j.id.toString() !== jobId.toString());
      await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(filteredJobs));
      setJobs(filteredJobs);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting job:', err);
      setError(err);
      return false;
    }
  }, []);

  //get job by id
  const getJobById = useCallback((jobId) => {
    return jobs.find(j => j.id.toString() === jobId.toString()) || null;
  }, [jobs]);

  // get jobs by customer id 
  const getJobsByCustomerId = useCallback((customerId) => {
    return jobs.filter(j => j.customerId.toString() === customerId.toString());
  }, [jobs]);

  //load jobs
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return {
    jobs,
    loading,
    error,
    loadJobs,
    addJob,
    updateJob,
    deleteJob,
    getJobById,
    getJobsByCustomerId,
  };
};
