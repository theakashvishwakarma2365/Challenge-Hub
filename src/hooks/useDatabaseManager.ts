import { useState, useEffect } from 'react';
import { Challenge, Task, DailyProgress, VideoReflection, UserSettings } from '../types';
import { UserProfile } from '../utils/indexedDatabase';
import { databaseManager } from '../utils/indexedDatabase';
import { getCurrentDay } from '../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';

export function useDatabaseManager() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [videoReflections, setVideoReflections] = useState<VideoReflection[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    theme: 'light',
    notifications: true,
    reminderTimes: ['09:00', '18:00'],
    timezone: 'UTC',
    language: 'en',
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data from database
  useEffect(() => {
    loadAllData();
  }, []);

  // Update challenge days periodically and when challenges change
  useEffect(() => {
    if (challenges.length > 0 && !isLoading) {
      // Update immediately
      updateAllChallengesDays();
      
      // Set up interval to check daily (every 24 hours)
      const interval = setInterval(() => {
        updateAllChallengesDays();
      }, 24 * 60 * 60 * 1000); // 24 hours
      
      return () => clearInterval(interval);
    }
  }, [challenges.length, isLoading]);

  // Check for day changes when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && challenges.length > 0) {
        updateAllChallengesDays();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [challenges.length]);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        challengesData,
        progressData,
        reflectionsData,
        settingsData,
        profileData
      ] = await Promise.all([
        databaseManager.getAllChallenges(),
        databaseManager.getDailyProgress(),
        databaseManager.getVideoReflections(),
        databaseManager.getUserSettings(),
        databaseManager.getUserProfile()
      ]);

      setChallenges(challengesData);
      setDailyProgress(progressData);
      setVideoReflections(reflectionsData);
      
      if (settingsData) {
        setUserSettings(settingsData);
      }
      
      setUserProfile(profileData);
      
      // Update challenge days after loading data
      setTimeout(() => {
        updateAllChallengesDays();
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Database error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // User Profile methods
  const saveUserProfile = async (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const profileData: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
        id: userProfile?.id || uuidv4(),
        ...profile
      };

      await databaseManager.createOrUpdateUserProfile(profileData);
      await loadUserProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user profile');
      throw err;
    }
  };

  const loadUserProfile = async () => {
    try {
      const profile = await databaseManager.getUserProfile();
      setUserProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user profile');
    }
  };

  // Settings methods
  const saveSettings = async (settings: UserSettings) => {
    try {
      await databaseManager.saveUserSettings(settings);
      setUserSettings(settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
      throw err;
    }
  };

  // Challenge methods
  const createChallenge = async (challengeData: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt' | 'currentDay'>) => {
    try {
      // Calculate current day based on start date
      const currentDay = getCurrentDay(challengeData.startDate);
      
      // Set initial status based on start date
      let initialStatus: Challenge['status'];
      if (currentDay < 1) {
        initialStatus = 'draft'; // Future start date
      } else if (currentDay > challengeData.totalDays) {
        initialStatus = 'completed'; // Past end date
      } else {
        initialStatus = challengeData.status || 'active'; // Use provided status or default to active
      }
      
      const newChallenge: Challenge = {
        ...challengeData,
        id: uuidv4(),
        currentDay: Math.max(1, currentDay), // Ensure minimum day is 1
        status: initialStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await databaseManager.saveChallenge(newChallenge);
      setChallenges(prev => [newChallenge, ...prev]);
      return newChallenge;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create challenge');
      throw err;
    }
  };

  // Update challenge current day based on actual date
  const updateChallengeDay = async (challengeId: string) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      const actualCurrentDay = getCurrentDay(challenge.startDate);
      
      // Determine status based on days
      let status = challenge.status;
      if (actualCurrentDay > challenge.totalDays) {
        status = 'completed';
      } else if (actualCurrentDay < 1) {
        status = 'draft'; // Challenge hasn't started yet
      } else {
        status = 'active';
      }

      if (actualCurrentDay !== challenge.currentDay || status !== challenge.status) {
        await updateChallenge(challengeId, { 
          currentDay: Math.max(1, actualCurrentDay),
          status
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update challenge day');
    }
  };

  // Update all active challenges' days
  const updateAllChallengesDays = async () => {
    try {
      const activeChallenges = challenges.filter(c => c.status === 'active' || c.status === 'draft');
      
      for (const challenge of activeChallenges) {
        await updateChallengeDay(challenge.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update challenges days');
    }
  };

  const updateChallenge = async (id: string, updates: Partial<Challenge>) => {
    try {
      const existingChallenge = challenges.find(c => c.id === id);
      if (!existingChallenge) throw new Error('Challenge not found');

      const updatedChallenge = {
        ...existingChallenge,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await databaseManager.saveChallenge(updatedChallenge);
      setChallenges(prev => prev.map(c => c.id === id ? updatedChallenge : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update challenge');
      throw err;
    }
  };

  const deleteChallenge = async (id: string) => {
    try {
      await databaseManager.deleteChallenge(id);
      setChallenges(prev => prev.filter(c => c.id !== id));
      setDailyProgress(prev => prev.filter(p => p.challengeId !== id));
      setVideoReflections(prev => prev.filter(v => v.challengeId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete challenge');
      throw err;
    }
  };

  // Task methods
  const addTask = async (challengeId: string, task: Omit<Task, 'id'>) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) throw new Error('Challenge not found');

      const newTask = {
        ...task,
        id: uuidv4(),
      };

      const updatedChallenge = {
        ...challenge,
        tasks: [...challenge.tasks, newTask],
        updatedAt: new Date().toISOString()
      };

      await databaseManager.saveChallenge(updatedChallenge);
      setChallenges(prev => prev.map(c => c.id === challengeId ? updatedChallenge : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      throw err;
    }
  };

  const updateTask = async (challengeId: string, taskId: string, updates: Partial<Task>) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) throw new Error('Challenge not found');

      const updatedTasks = challenge.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );

      const updatedChallenge = {
        ...challenge,
        tasks: updatedTasks,
        updatedAt: new Date().toISOString()
      };

      await databaseManager.saveChallenge(updatedChallenge);
      setChallenges(prev => prev.map(c => c.id === challengeId ? updatedChallenge : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (challengeId: string, taskId: string) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) throw new Error('Challenge not found');

      const updatedTasks = challenge.tasks.filter(task => task.id !== taskId);
      const updatedChallenge = {
        ...challenge,
        tasks: updatedTasks,
        updatedAt: new Date().toISOString()
      };

      await databaseManager.saveChallenge(updatedChallenge);
      setChallenges(prev => prev.map(c => c.id === challengeId ? updatedChallenge : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };

  // Daily Progress methods
  const recordDailyProgress = async (challengeId: string, completedTaskIds: string[], notes?: string, mood?: 1 | 2 | 3 | 4 | 5) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) throw new Error('Challenge not found');

      const today = new Date().toISOString().split('T')[0];
      const currentDay = getCurrentDay(challenge.startDate);
      const totalTasks = challenge.tasks.length;
      const completionPercentage = totalTasks > 0 ? Math.round((completedTaskIds.length / totalTasks) * 100) : 0;

      const progressEntry: DailyProgress = {
        id: uuidv4(),
        challengeId,
        date: today,
        day: Math.max(1, currentDay), // Ensure day is at least 1
        completedTasks: completedTaskIds,
        totalTasks,
        completionPercentage,
        notes,
        mood: mood || 3,
      };

      await databaseManager.saveDailyProgress(progressEntry);
      setDailyProgress(prev => {
        const filtered = prev.filter(p => !(p.challengeId === challengeId && p.date === today));
        return [progressEntry, ...filtered];
      });
      
      // Update challenge's current day after recording progress
      await updateChallengeDay(challengeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record daily progress');
      throw err;
    }
  };

  // Video Reflection methods
  const addVideoReflection = async (reflection: Omit<VideoReflection, 'id'>) => {
    try {
      const newReflection: VideoReflection = {
        ...reflection,
        id: uuidv4(),
      };

      await databaseManager.saveVideoReflection(newReflection);
      setVideoReflections(prev => [newReflection, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add video reflection');
      throw err;
    }
  };

  // Export/Import methods
  const exportAllData = async () => {
    try {
      const data = await databaseManager.exportAllData();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `challenges_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      throw err;
    }
  };

  const importData = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      await databaseManager.importData(data);
      await loadAllData(); // Reload all data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
      throw err;
    }
  };

  const clearAllData = async () => {
    try {
      await databaseManager.clearAllData();
      setChallenges([]);
      setDailyProgress([]);
      setVideoReflections([]);
      setUserProfile(null);
      setUserSettings({
        theme: 'light',
        notifications: true,
        reminderTimes: ['09:00', '18:00'],
        timezone: 'UTC',
        language: 'en',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear data');
      throw err;
    }
  };

  // Helper methods
  const getActiveChallenge = () => {
    // Find active challenge or draft challenge that should be active today
    return challenges.find(c => {
      if (c.status === 'active') return true;
      if (c.status === 'draft') {
        const currentDay = getCurrentDay(c.startDate);
        return currentDay >= 1 && currentDay <= c.totalDays;
      }
      return false;
    }) || null;
  };

  const getTodayProgress = (challengeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dailyProgress.find(p => p.challengeId === challengeId && p.date === today) || null;
  };

  const getChallengeProgressData = (challengeId: string) => {
    return dailyProgress.filter(p => p.challengeId === challengeId);
  };

  const getChallengeReflections = (challengeId: string) => {
    return videoReflections.filter(v => v.challengeId === challengeId);
  };

  // Day counting helper functions
  const getChallengeCurrentDay = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return 0;
    
    return getCurrentDay(challenge.startDate);
  };

  const getChallengeDaysRemaining = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return 0;
    
    const currentDay = getCurrentDay(challenge.startDate);
    return Math.max(0, challenge.totalDays - currentDay);
  };

  const getChallengeProgress = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return { completed: 0, total: 0, percentage: 0 };
    
    const currentDay = getCurrentDay(challenge.startDate);
    const progressEntries = dailyProgress.filter(p => p.challengeId === challengeId);
    
    return {
      completed: progressEntries.length,
      total: challenge.totalDays,
      currentDay: Math.max(1, currentDay),
      percentage: Math.round((progressEntries.length / challenge.totalDays) * 100)
    };
  };

  const isChallengeCompleted = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return false;
    
    const currentDay = getCurrentDay(challenge.startDate);
    return currentDay > challenge.totalDays || challenge.status === 'completed';
  };

  const isChallengeActive = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return false;
    
    const currentDay = getCurrentDay(challenge.startDate);
    
    return currentDay >= 1 && currentDay <= challenge.totalDays;
  };

  return {
    // State
    challenges,
    dailyProgress,
    videoReflections,
    userSettings,
    userProfile,
    isLoading,
    error,
    
    // User Profile methods
    saveUserProfile,
    loadUserProfile,
    
    // Settings methods
    saveSettings,
    
    // Challenge methods
    createChallenge,
    updateChallenge,
    deleteChallenge,
    
    // Task methods
    addTask,
    updateTask,
    deleteTask,
    
    // Progress methods
    recordDailyProgress,
    addVideoReflection,
    
    // Data management
    exportAllData,
    importData,
    clearAllData,
    
    // Helper methods
    getActiveChallenge,
    getTodayProgress,
    getChallengeProgress,
    getChallengeProgressData,
    getChallengeReflections,
    getChallengeCurrentDay,
    getChallengeDaysRemaining,
    isChallengeCompleted,
    isChallengeActive,
    updateChallengeDay,
    updateAllChallengesDays,
    
    // Utility
    refreshData: loadAllData,
    clearError: () => setError(null)
  };
}
