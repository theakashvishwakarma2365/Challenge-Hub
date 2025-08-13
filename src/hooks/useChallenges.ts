import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Challenge, Task, DailyProgress, VideoReflection } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useChallenges() {
  const [challenges, setChallenges] = useLocalStorage<Challenge[]>('challenges', []);
  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress[]>('dailyProgress', []);
  const [videoReflections, setVideoReflections] = useLocalStorage<VideoReflection[]>('videoReflections', []);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const active = challenges.find(c => c.status === 'active');
    setActiveChallenge(active || null);
  }, [challenges]);

  const createChallenge = (challengeData: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt' | 'currentDay'>) => {
    const newChallenge: Challenge = {
      ...challengeData,
      id: uuidv4(),
      currentDay: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setChallenges(prev => [...prev, newChallenge]);
    return newChallenge;
  };

  const updateChallenge = (id: string, updates: Partial<Challenge>) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, ...updates, updatedAt: new Date().toISOString() }
          : challenge
      )
    );
  };

  const deleteChallenge = (id: string) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
    setDailyProgress(prev => prev.filter(p => p.challengeId !== id));
    setVideoReflections(prev => prev.filter(v => v.challengeId !== id));
  };

  const addTask = (challengeId: string, task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
    };

    updateChallenge(challengeId, {
      tasks: [...(challenges.find(c => c.id === challengeId)?.tasks || []), newTask]
    });
  };

  const updateTask = (challengeId: string, taskId: string, updates: Partial<Task>) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const updatedTasks = challenge.tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );

    updateChallenge(challengeId, { tasks: updatedTasks });
  };

  const deleteTask = (challengeId: string, taskId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const updatedTasks = challenge.tasks.filter(task => task.id !== taskId);
    updateChallenge(challengeId, { tasks: updatedTasks });
  };

  const recordDailyProgress = (challengeId: string, completedTaskIds: string[], notes?: string, mood?: 1 | 2 | 3 | 4 | 5) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const today = new Date().toISOString().split('T')[0];
    const totalTasks = challenge.tasks.length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTaskIds.length / totalTasks) * 100) : 0;

    const progressEntry: DailyProgress = {
      id: uuidv4(),
      challengeId,
      date: today,
      completedTasks: completedTaskIds,
      totalTasks,
      completionPercentage,
      notes,
      mood: mood || 3,
    };

    setDailyProgress(prev => {
      const filtered = prev.filter(p => !(p.challengeId === challengeId && p.date === today));
      return [...filtered, progressEntry];
    });
  };

  const addVideoReflection = (reflection: Omit<VideoReflection, 'id'>) => {
    const newReflection: VideoReflection = {
      ...reflection,
      id: uuidv4(),
    };

    setVideoReflections(prev => [...prev, newReflection]);
  };

  const getTodayProgress = (challengeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dailyProgress.find(p => p.challengeId === challengeId && p.date === today);
  };

  const getChallengeProgress = (challengeId: string) => {
    return dailyProgress.filter(p => p.challengeId === challengeId);
  };

  const getChallengeReflections = (challengeId: string) => {
    return videoReflections.filter(v => v.challengeId === challengeId);
  };

  return {
    challenges,
    activeChallenge,
    dailyProgress,
    videoReflections,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    addTask,
    updateTask,
    deleteTask,
    recordDailyProgress,
    addVideoReflection,
    getTodayProgress,
    getChallengeProgress,
    getChallengeReflections,
  };
}