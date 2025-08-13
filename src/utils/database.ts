import sqlite3 from 'sqlite3';
import { Challenge, Task, DailyProgress, VideoReflection, UserSettings } from '../types';

// Enable verbose mode for better debugging
const db = new (sqlite3.verbose()).Database('challenges_tracker.db');

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  signature?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

class DatabaseManager {
  private db: sqlite3.Database;

  constructor() {
    this.db = db;
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    // Create tables if they don't exist
    this.db.serialize(() => {
      // User Profile table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT,
          signature TEXT,
          avatar TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);

      // User Settings table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS user_settings (
          id TEXT PRIMARY KEY,
          theme TEXT NOT NULL DEFAULT 'light',
          notifications BOOLEAN NOT NULL DEFAULT 1,
          reminder_times TEXT NOT NULL DEFAULT '["09:00","18:00"]',
          timezone TEXT NOT NULL DEFAULT 'UTC',
          language TEXT NOT NULL DEFAULT 'en',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);

      // Challenges table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS challenges (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          current_day INTEGER NOT NULL,
          total_days INTEGER NOT NULL,
          status TEXT NOT NULL,
          rules TEXT NOT NULL,
          color TEXT NOT NULL,
          icon TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);

      // Tasks table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          challenge_id TEXT NOT NULL,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT 0,
          time TEXT NOT NULL,
          description TEXT,
          priority TEXT NOT NULL,
          estimated_duration INTEGER NOT NULL,
          FOREIGN KEY (challenge_id) REFERENCES challenges (id) ON DELETE CASCADE
        )
      `);

      // Daily Progress table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS daily_progress (
          id TEXT PRIMARY KEY,
          challenge_id TEXT NOT NULL,
          date TEXT NOT NULL,
          completed_tasks TEXT NOT NULL,
          total_tasks INTEGER NOT NULL,
          completion_percentage INTEGER NOT NULL,
          notes TEXT,
          mood INTEGER NOT NULL,
          FOREIGN KEY (challenge_id) REFERENCES challenges (id) ON DELETE CASCADE
        )
      `);

      // Video Reflections table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS video_reflections (
          id TEXT PRIMARY KEY,
          challenge_id TEXT NOT NULL,
          day INTEGER NOT NULL,
          date TEXT NOT NULL,
          duration INTEGER NOT NULL,
          questions TEXT NOT NULL,
          notes TEXT,
          mood INTEGER NOT NULL,
          FOREIGN KEY (challenge_id) REFERENCES challenges (id) ON DELETE CASCADE
        )
      `);
    });
  }

  // User Profile methods
  async createOrUpdateUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      this.db.run(
        `INSERT OR REPLACE INTO user_profiles 
         (id, name, email, signature, avatar, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM user_profiles WHERE id = ?), ?), ?)`,
        [profile.id, profile.name, profile.email, profile.signature, profile.avatar, profile.id, now, now],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getUserProfile(): Promise<UserProfile | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM user_profiles LIMIT 1',
        (err, row: any) => {
          if (err) reject(err);
          else if (row) {
            resolve({
              id: row.id,
              name: row.name,
              email: row.email,
              signature: row.signature,
              avatar: row.avatar,
              createdAt: row.created_at,
              updatedAt: row.updated_at
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  // Settings methods
  async saveUserSettings(settings: UserSettings): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      this.db.run(
        `INSERT OR REPLACE INTO user_settings 
         (id, theme, notifications, reminder_times, timezone, language, created_at, updated_at) 
         VALUES ('default', ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM user_settings WHERE id = 'default'), ?), ?)`,
        [
          settings.theme,
          settings.notifications ? 1 : 0,
          JSON.stringify(settings.reminderTimes),
          settings.timezone,
          settings.language,
          now,
          now
        ],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getUserSettings(): Promise<UserSettings | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM user_settings WHERE id = "default"',
        (err, row: any) => {
          if (err) reject(err);
          else if (row) {
            resolve({
              theme: row.theme,
              notifications: row.notifications === 1,
              reminderTimes: JSON.parse(row.reminder_times),
              timezone: row.timezone,
              language: row.language
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  // Challenge methods
  async saveChallenge(challenge: Challenge): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');

        // Save challenge
        this.db.run(
          `INSERT OR REPLACE INTO challenges 
           (id, name, description, start_date, end_date, current_day, total_days, status, rules, color, icon, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            challenge.id,
            challenge.name,
            challenge.description,
            challenge.startDate,
            challenge.endDate,
            challenge.currentDay,
            challenge.totalDays,
            challenge.status,
            JSON.stringify(challenge.rules),
            challenge.color,
            challenge.icon,
            challenge.createdAt,
            challenge.updatedAt
          ],
          function(err) {
            if (err) {
              reject(err);
              return;
            }
          }
        );

        // Delete existing tasks for this challenge
        this.db.run('DELETE FROM tasks WHERE challenge_id = ?', [challenge.id]);

        // Save tasks
        const taskStmt = this.db.prepare(
          'INSERT INTO tasks (id, challenge_id, name, category, completed, time, description, priority, estimated_duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        challenge.tasks.forEach(task => {
          taskStmt.run([
            task.id,
            challenge.id,
            task.name,
            task.category,
            task.completed ? 1 : 0,
            task.time,
            task.description,
            task.priority,
            task.estimatedDuration
          ]);
        });

        taskStmt.finalize();

        this.db.run('COMMIT', function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM challenges ORDER BY created_at DESC',
        async (err, rows: any[]) => {
          if (err) {
            reject(err);
            return;
          }

          const challenges: Challenge[] = [];
          
          for (const row of rows) {
            const tasks = await this.getTasksForChallenge(row.id);
            challenges.push({
              id: row.id,
              name: row.name,
              description: row.description,
              startDate: row.start_date,
              endDate: row.end_date,
              currentDay: row.current_day,
              totalDays: row.total_days,
              status: row.status,
              rules: JSON.parse(row.rules),
              tasks,
              color: row.color,
              icon: row.icon,
              createdAt: row.created_at,
              updatedAt: row.updated_at
            });
          }

          resolve(challenges);
        }
      );
    });
  }

  private async getTasksForChallenge(challengeId: string): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM tasks WHERE challenge_id = ?',
        [challengeId],
        (err, rows: any[]) => {
          if (err) {
            reject(err);
            return;
          }

          const tasks: Task[] = rows.map(row => ({
            id: row.id,
            name: row.name,
            category: row.category,
            completed: row.completed === 1,
            time: row.time,
            description: row.description,
            priority: row.priority,
            estimatedDuration: row.estimated_duration
          }));

          resolve(tasks);
        }
      );
    });
  }

  async deleteChallenge(challengeId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        
        this.db.run('DELETE FROM video_reflections WHERE challenge_id = ?', [challengeId]);
        this.db.run('DELETE FROM daily_progress WHERE challenge_id = ?', [challengeId]);
        this.db.run('DELETE FROM tasks WHERE challenge_id = ?', [challengeId]);
        this.db.run('DELETE FROM challenges WHERE id = ?', [challengeId]);
        
        this.db.run('COMMIT', function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  // Daily Progress methods
  async saveDailyProgress(progress: DailyProgress): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO daily_progress 
         (id, challenge_id, date, completed_tasks, total_tasks, completion_percentage, notes, mood) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          progress.id,
          progress.challengeId,
          progress.date,
          JSON.stringify(progress.completedTasks),
          progress.totalTasks,
          progress.completionPercentage,
          progress.notes,
          progress.mood
        ],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getDailyProgress(): Promise<DailyProgress[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM daily_progress ORDER BY date DESC',
        (err, rows: any[]) => {
          if (err) {
            reject(err);
            return;
          }

          const progress: DailyProgress[] = rows.map(row => ({
            id: row.id,
            challengeId: row.challenge_id,
            date: row.date,
            completedTasks: JSON.parse(row.completed_tasks),
            totalTasks: row.total_tasks,
            completionPercentage: row.completion_percentage,
            notes: row.notes,
            mood: row.mood
          }));

          resolve(progress);
        }
      );
    });
  }

  // Video Reflections methods
  async saveVideoReflection(reflection: VideoReflection): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO video_reflections 
         (id, challenge_id, day, date, duration, questions, notes, mood) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reflection.id,
          reflection.challengeId,
          reflection.day,
          reflection.date,
          reflection.duration,
          JSON.stringify(reflection.questions),
          reflection.notes,
          reflection.mood
        ],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getVideoReflections(): Promise<VideoReflection[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM video_reflections ORDER BY date DESC',
        (err, rows: any[]) => {
          if (err) {
            reject(err);
            return;
          }

          const reflections: VideoReflection[] = rows.map(row => ({
            id: row.id,
            challengeId: row.challenge_id,
            day: row.day,
            date: row.date,
            duration: row.duration,
            questions: JSON.parse(row.questions),
            notes: row.notes,
            mood: row.mood
          }));

          resolve(reflections);
        }
      );
    });
  }

  // Export all data
  async exportAllData(): Promise<any> {
    const [challenges, dailyProgress, videoReflections, userSettings, userProfile] = await Promise.all([
      this.getAllChallenges(),
      this.getDailyProgress(),
      this.getVideoReflections(),
      this.getUserSettings(),
      this.getUserProfile()
    ]);

    return {
      challenges,
      dailyProgress,
      videoReflections,
      userSettings,
      userProfile,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  // Import data
  async importData(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(async () => {
        this.db.run('BEGIN TRANSACTION');

        try {
          // Import user profile
          if (data.userProfile) {
            await this.createOrUpdateUserProfile(data.userProfile);
          }

          // Import settings
          if (data.userSettings) {
            await this.saveUserSettings(data.userSettings);
          }

          // Import challenges
          if (data.challenges) {
            for (const challenge of data.challenges) {
              await this.saveChallenge(challenge);
            }
          }

          // Import daily progress
          if (data.dailyProgress) {
            for (const progress of data.dailyProgress) {
              await this.saveDailyProgress(progress);
            }
          }

          // Import video reflections
          if (data.videoReflections) {
            for (const reflection of data.videoReflections) {
              await this.saveVideoReflection(reflection);
            }
          }

          this.db.run('COMMIT', function(err) {
            if (err) reject(err);
            else resolve();
          });
        } catch (error) {
          this.db.run('ROLLBACK');
          reject(error);
        }
      });
    });
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        
        this.db.run('DELETE FROM video_reflections');
        this.db.run('DELETE FROM daily_progress');
        this.db.run('DELETE FROM tasks');
        this.db.run('DELETE FROM challenges');
        this.db.run('DELETE FROM user_settings');
        this.db.run('DELETE FROM user_profiles');
        
        this.db.run('COMMIT', function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  // Close database connection
  close(): void {
    this.db.close();
  }
}

// Create singleton instance
export const databaseManager = new DatabaseManager();
