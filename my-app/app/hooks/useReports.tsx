import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REPORTS_KEY = 'reports';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //load reports from async
  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(REPORTS_KEY);
      const loadedReports = data ? JSON.parse(data) : [];
      setReports(loadedReports);
      setError(null);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  //add report
  const addReport = useCallback(async (newReport) => {
    try {
      const data = await AsyncStorage.getItem(REPORTS_KEY);
      const currentReports = data ? JSON.parse(data) : [];
      const reportWithId = { ...newReport, id: Date.now() };
      const updatedReports = [...currentReports, reportWithId];
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updatedReports));
      setReports(updatedReports);
      setError(null);
      return reportWithId;
    } catch (err) {
      console.error('Error adding report:', err);
      setError(err);
      return null;
    }
  }, []);

  //update report
  const updateReport = useCallback(async (reportId, updatedReport) => {
    try {
      const data = await AsyncStorage.getItem(REPORTS_KEY);
      const currentReports = data ? JSON.parse(data) : [];
      const reportIndex = currentReports.findIndex(r => r.id.toString() === reportId.toString());
      
      if (reportIndex !== -1) {
        currentReports[reportIndex] = { ...updatedReport, id: reportId };
        await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(currentReports));
        setReports(currentReports);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating report:', err);
      setError(err);
      return false;
    }
  }, []);

  //delete report
  const deleteReport = useCallback(async (reportId) => {
    try {
      const data = await AsyncStorage.getItem(REPORTS_KEY);
      const currentReports = data ? JSON.parse(data) : [];
      const filteredReports = currentReports.filter(r => r.id.toString() !== reportId.toString());
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(filteredReports));
      setReports(filteredReports);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting report:', err);
      setError(err);
      return false;
    }
  }, []);

  //get report by id
  const getReportById = useCallback((reportId) => {
    return reports.find(r => r.id.toString() === reportId.toString()) || null;
  }, [reports]);

  //load reports 
  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return {
    reports,
    loading,
    error,
    loadReports,
    addReport,
    updateReport,
    deleteReport,
    getReportById,
  };
};
