import { useState, useEffect, useCallback } from 'react';
import { Challenge, UserSettings } from '../types';

interface NotificationManagerProps {
  activeChallenge: Challenge | null;
  userSettings: UserSettings;
}

interface TaskReminder {
  taskId: string;
  taskName: string;
  taskTime: string;
  reminderTime: Date;
  notified: boolean;
}

export const useNotificationManager = ({ activeChallenge, userSettings }: NotificationManagerProps) => {
  const [taskReminders, setTaskReminders] = useState<TaskReminder[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    }
    return false;
  }, []);

  // Show notification
  const showNotification = useCallback((title: string, body: string, icon?: string) => {
    if (notificationPermission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: true,
      });

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

      return notification;
    }
    return null;
  }, [notificationPermission]);

  // Convert time string to IST Date object
  const getISTDateTime = useCallback((timeString: string): Date => {
    const now = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Create date in IST
    const istDate = new Date(now);
    istDate.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (istDate.getTime() < now.getTime()) {
      istDate.setDate(istDate.getDate() + 1);
    }
    
    return istDate;
  }, []);

  // Calculate reminder time (10 minutes before task)
  const getReminderTime = useCallback((taskTime: string): Date => {
    const taskDateTime = getISTDateTime(taskTime);
    const reminderTime = new Date(taskDateTime.getTime() - 10 * 60 * 1000); // 10 minutes before
    return reminderTime;
  }, [getISTDateTime]);

  // Generate task reminders
  const generateTaskReminders = useCallback(() => {
    if (!activeChallenge || !userSettings.notifications) {
      setTaskReminders([]);
      return;
    }

    const reminders: TaskReminder[] = activeChallenge.tasks.map(task => ({
      taskId: task.id,
      taskName: task.name,
      taskTime: task.time,
      reminderTime: getReminderTime(task.time),
      notified: false,
    }));

    setTaskReminders(reminders);
  }, [activeChallenge, userSettings.notifications, getReminderTime]);

  // Check for due reminders
  const checkReminders = useCallback(() => {
    const now = new Date();
    
    setTaskReminders(prev => 
      prev.map(reminder => {
        if (!reminder.notified && now >= reminder.reminderTime) {
          // Show notification
          showNotification(
            `Upcoming Task Reminder 🔔`,
            `"${reminder.taskName}" is starting in 10 minutes (${reminder.taskTime})`,
            '/favicon.ico'
          );
          
          return { ...reminder, notified: true };
        }
        return reminder;
      })
    );
  }, [showNotification]);

  // Initialize notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      // Request permission if notifications are enabled
      if (userSettings.notifications && Notification.permission === 'default') {
        requestNotificationPermission();
      }
    }
  }, [userSettings.notifications, requestNotificationPermission]);

  // Generate reminders when challenge or settings change
  useEffect(() => {
    generateTaskReminders();
  }, [generateTaskReminders]);

  // Set up reminder checking interval
  useEffect(() => {
    if (!userSettings.notifications || taskReminders.length === 0) {
      return;
    }

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    
    // Also check immediately
    checkReminders();

    return () => clearInterval(interval);
  }, [userSettings.notifications, taskReminders.length, checkReminders]);

  // Reset reminders daily
  useEffect(() => {
    const resetReminders = () => {
      generateTaskReminders();
    };

    // Reset at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    const timeout = setTimeout(() => {
      resetReminders();
      
      // Set up daily interval
      const dailyInterval = setInterval(resetReminders, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, [generateTaskReminders]);

  return {
    notificationPermission,
    requestNotificationPermission,
    taskReminders: taskReminders.filter(r => !r.notified),
    showNotification,
  };
};
