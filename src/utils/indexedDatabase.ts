import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Challenge, DailyProgress, VideoReflection, UserSettings } from '../types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  signature: string;
  createdAt: string;
  updatedAt: string;
}

interface ChallengesTrackerDB extends DBSchema {
  challenges: {
    key: string;
    value: Challenge;
  };
  dailyProgress: {
    key: string;
    value: DailyProgress;
    indexes: {
      'by-challenge': string;
      'by-date': string;
    };
  };
  videoReflections: {
    key: string;
    value: VideoReflection;
    indexes: {
      'by-challenge': string;
    };
  };
  userSettings: {
    key: string;
    value: UserSettings & { id: string };
  };
  userProfile: {
    key: string;
    value: UserProfile;
  };
}

class DatabaseManager {
  private db: IDBPDatabase<ChallengesTrackerDB> | null = null;
  private dbName = 'ChallengesTrackerDB';
  private dbVersion = 1;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<ChallengesTrackerDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        // Create challenges store
        if (!db.objectStoreNames.contains('challenges')) {
          db.createObjectStore('challenges', { keyPath: 'id' });
        }

        // Create dailyProgress store with indexes
        if (!db.objectStoreNames.contains('dailyProgress')) {
          const progressStore = db.createObjectStore('dailyProgress', { keyPath: 'id' });
          progressStore.createIndex('by-challenge', 'challengeId', { unique: false });
          progressStore.createIndex('by-date', 'date', { unique: false });
        }

        // Create videoReflections store with indexes
        if (!db.objectStoreNames.contains('videoReflections')) {
          const reflectionsStore = db.createObjectStore('videoReflections', { keyPath: 'id' });
          reflectionsStore.createIndex('by-challenge', 'challengeId', { unique: false });
        }

        // Create userSettings store
        if (!db.objectStoreNames.contains('userSettings')) {
          db.createObjectStore('userSettings', { keyPath: 'id' });
        }

        // Create userProfile store
        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'id' });
        }
      },
    });
  }

  private async ensureInit(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
  }

  // Challenge operations
  async saveChallenge(challenge: Challenge): Promise<void> {
    await this.ensureInit();
    await this.db!.put('challenges', challenge);
  }

  async getAllChallenges(): Promise<Challenge[]> {
    await this.ensureInit();
    return await this.db!.getAll('challenges');
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    await this.ensureInit();
    return await this.db!.get('challenges', id);
  }

  async deleteChallenge(id: string): Promise<void> {
    await this.ensureInit();
    const tx = this.db!.transaction(['challenges', 'dailyProgress', 'videoReflections'], 'readwrite');
    
    // Delete challenge
    await tx.objectStore('challenges').delete(id);
    
    // Delete related progress entries
    const progressIndex = tx.objectStore('dailyProgress').index('by-challenge');
    const progressEntries = await progressIndex.getAll(id);
    for (const entry of progressEntries) {
      await tx.objectStore('dailyProgress').delete(entry.id);
    }
    
    // Delete related video reflections
    const reflectionsIndex = tx.objectStore('videoReflections').index('by-challenge');
    const reflectionEntries = await reflectionsIndex.getAll(id);
    for (const entry of reflectionEntries) {
      await tx.objectStore('videoReflections').delete(entry.id);
    }
    
    await tx.done;
  }

  // Daily Progress operations
  async saveDailyProgress(progress: DailyProgress): Promise<void> {
    await this.ensureInit();
    await this.db!.put('dailyProgress', progress);
  }

  async getDailyProgress(): Promise<DailyProgress[]> {
    await this.ensureInit();
    return await this.db!.getAll('dailyProgress');
  }

  async getDailyProgressByChallenge(challengeId: string): Promise<DailyProgress[]> {
    await this.ensureInit();
    return await this.db!.getAllFromIndex('dailyProgress', 'by-challenge', challengeId);
  }

  // Video Reflection operations
  async saveVideoReflection(reflection: VideoReflection): Promise<void> {
    await this.ensureInit();
    await this.db!.put('videoReflections', reflection);
  }

  async getVideoReflections(): Promise<VideoReflection[]> {
    await this.ensureInit();
    return await this.db!.getAll('videoReflections');
  }

  async getVideoReflectionsByChallenge(challengeId: string): Promise<VideoReflection[]> {
    await this.ensureInit();
    return await this.db!.getAllFromIndex('videoReflections', 'by-challenge', challengeId);
  }

  // User Settings operations
  async saveUserSettings(settings: UserSettings): Promise<void> {
    await this.ensureInit();
    const settingsWithId = { ...settings, id: 'user-settings' };
    await this.db!.put('userSettings', settingsWithId);
  }

  async getUserSettings(): Promise<UserSettings | null> {
    await this.ensureInit();
    const result = await this.db!.get('userSettings', 'user-settings');
    if (!result) return null;
    
    // Remove the id field when returning
    const { id, ...settings } = result;
    return settings as UserSettings;
  }

  // User Profile operations
  async createOrUpdateUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
    await this.ensureInit();
    
    const existingProfile = await this.db!.get('userProfile', profile.id);
    const now = new Date().toISOString();
    
    const updatedProfile: UserProfile = {
      ...profile,
      createdAt: existingProfile?.createdAt || now,
      updatedAt: now,
    };
    
    await this.db!.put('userProfile', updatedProfile);
  }

  async getUserProfile(): Promise<UserProfile | null> {
    await this.ensureInit();
    const profiles = await this.db!.getAll('userProfile');
    return profiles.length > 0 ? profiles[0] : null;
  }

  // Data management operations
  async exportAllData(): Promise<any> {
    await this.ensureInit();
    
    const [challenges, dailyProgress, videoReflections, userSettings, userProfile] = await Promise.all([
      this.getAllChallenges(),
      this.getDailyProgress(),
      this.getVideoReflections(),
      this.getUserSettings(),
      this.getUserProfile(),
    ]);

    return {
      challenges,
      dailyProgress,
      videoReflections,
      userSettings,
      userProfile,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
  }

  async importData(data: any): Promise<void> {
    await this.ensureInit();
    
    const tx = this.db!.transaction(['challenges', 'dailyProgress', 'videoReflections', 'userSettings', 'userProfile'], 'readwrite');
    
    try {
      // Clear existing data
      await Promise.all([
        tx.objectStore('challenges').clear(),
        tx.objectStore('dailyProgress').clear(),
        tx.objectStore('videoReflections').clear(),
        tx.objectStore('userSettings').clear(),
        tx.objectStore('userProfile').clear(),
      ]);

      // Import new data
      if (data.challenges) {
        for (const challenge of data.challenges) {
          await tx.objectStore('challenges').put(challenge);
        }
      }

      if (data.dailyProgress) {
        for (const progress of data.dailyProgress) {
          await tx.objectStore('dailyProgress').put(progress);
        }
      }

      if (data.videoReflections) {
        for (const reflection of data.videoReflections) {
          await tx.objectStore('videoReflections').put(reflection);
        }
      }

      if (data.userSettings) {
        const settingsWithId = { ...data.userSettings, id: 'user-settings' };
        await tx.objectStore('userSettings').put(settingsWithId);
      }

      if (data.userProfile) {
        await tx.objectStore('userProfile').put(data.userProfile);
      }

      await tx.done;
    } catch (error) {
      tx.abort();
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    await this.ensureInit();
    
    const tx = this.db!.transaction(['challenges', 'dailyProgress', 'videoReflections', 'userSettings', 'userProfile'], 'readwrite');
    
    await Promise.all([
      tx.objectStore('challenges').clear(),
      tx.objectStore('dailyProgress').clear(),
      tx.objectStore('videoReflections').clear(),
      tx.objectStore('userSettings').clear(),
      tx.objectStore('userProfile').clear(),
    ]);
    
    await tx.done;
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export const databaseManager = new DatabaseManager();
