// Database Connection Test Utility
import { databaseManager } from './indexedDatabase';

export class DatabaseConnectionTest {
  static async runTests(): Promise<boolean> {
    console.log('🔄 Running Database Connection Tests...');
    
    try {
      // Test 1: Database Initialization
      console.log('Test 1: Database Initialization');
      await databaseManager.init();
      console.log('✅ Database initialized successfully');

      // Test 2: User Profile Operations
      console.log('Test 2: User Profile Operations');
      const testProfile = {
        id: 'test-profile-id',
        name: 'Test User',
        email: 'test@example.com',
        signature: 'Test Signature'
      };
      
      await databaseManager.createOrUpdateUserProfile(testProfile);
      const retrievedProfile = await databaseManager.getUserProfile();
      console.log('✅ User profile operations working:', retrievedProfile);

      // Test 3: Settings Operations
      console.log('Test 3: Settings Operations');
      const testSettings = {
        theme: 'light' as const,
        notifications: true,
        reminderTimes: ['09:00', '18:00'],
        timezone: 'UTC',
        language: 'en'
      };
      
      await databaseManager.saveUserSettings(testSettings);
      const retrievedSettings = await databaseManager.getUserSettings();
      console.log('✅ Settings operations working:', retrievedSettings);

      // Test 4: Challenge Operations
      console.log('Test 4: Challenge Operations');
      const testChallenge = {
        id: 'test-challenge-id',
        name: 'Test Challenge',
        description: 'A test challenge for database verification',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currentDay: 1,
        totalDays: 21,
        status: 'active' as const,
        rules: ['Rule 1', 'Rule 2'],
        tasks: [],
        color: '#3B82F6',
        icon: 'Target',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await databaseManager.saveChallenge(testChallenge);
      const challenges = await databaseManager.getAllChallenges();
      console.log('✅ Challenge operations working. Challenges count:', challenges.length);

      // Test 5: Daily Progress Operations
      console.log('Test 5: Daily Progress Operations');
      const testProgress = {
        id: 'test-progress-id',
        challengeId: 'test-challenge-id',
        date: new Date().toISOString().split('T')[0],
        day: 1,
        completedTasks: [],
        totalTasks: 0,
        completionPercentage: 0,
        mood: 3 as const
      };
      
      await databaseManager.saveDailyProgress(testProgress);
      const progressData = await databaseManager.getDailyProgress();
      console.log('✅ Daily progress operations working. Progress entries:', progressData.length);

      // Test 6: Video Reflection Operations
      console.log('Test 6: Video Reflection Operations');
      const testReflection = {
        id: 'test-reflection-id',
        challengeId: 'test-challenge-id',
        day: 1,
        date: new Date().toISOString().split('T')[0],
        duration: 300,
        questions: [],
        mood: 4 as const
      };
      
      await databaseManager.saveVideoReflection(testReflection);
      const reflections = await databaseManager.getVideoReflections();
      console.log('✅ Video reflection operations working. Reflections count:', reflections.length);

      // Test 7: Data Export/Import
      console.log('Test 7: Data Export Operations');
      const exportData = await databaseManager.exportAllData();
      console.log('✅ Data export working. Export contains:', Object.keys(exportData));

      // Clean up test data
      await databaseManager.deleteChallenge('test-challenge-id');
      console.log('✅ Test data cleaned up');

      console.log('🎉 All Database Connection Tests Passed!');
      return true;
      
    } catch (error) {
      console.error('❌ Database Connection Test Failed:', error);
      return false;
    }
  }

  static async quickConnectionTest(): Promise<boolean> {
    try {
      await databaseManager.init();
      const challenges = await databaseManager.getAllChallenges();
      const settings = await databaseManager.getUserSettings();
      
      console.log('✅ Quick connection test passed');
      console.log('- Challenges loaded:', challenges.length);
      console.log('- Settings loaded:', !!settings);
      
      return true;
    } catch (error) {
      console.error('❌ Quick connection test failed:', error);
      return false;
    }
  }
}

// Auto-run quick test in development
if (process.env.NODE_ENV === 'development') {
  DatabaseConnectionTest.quickConnectionTest();
}
