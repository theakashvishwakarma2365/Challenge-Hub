import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import MobileNavigation from './components/Layout/MobileNavigation';
import MultiChallengeDashboard from './components/Dashboard/MultiChallengeDashboard';
import TaskManager from './components/Tasks/TaskManager';
import VideoReflectionLog from './components/Video/VideoReflectionLog';
import ProgressAnalytics from './components/Progress/ProgressAnalytics';
import ChallengeManager from './components/Challenges/ChallengeManager';
import StepByChallengeCreator from './components/Create/StepByChallengeCreator';
import Settings from './components/Settings/Settings';
import { Challenge } from './types';
import { useDatabaseManager } from './hooks/useDatabaseManager';
import { useNotificationManager } from './hooks/useNotificationManager';
import { DatabaseConnectionTest } from './utils/databaseTest';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');

  const {
    challenges,
    userSettings,
    userProfile,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    addTask,
    updateTask,
    deleteTask,
    recordDailyProgress,
    addVideoReflection,
    getTodayProgress,
    getChallengeProgressData,
    getChallengeReflections,
    getActiveChallenge,
    exportAllData,
    importData,
    clearAllData,
    saveUserProfile,
    saveSettings,
    error,
  } = useDatabaseManager();

  // Test database connection on mount
  useEffect(() => {
    DatabaseConnectionTest.quickConnectionTest()
      .then((success) => {
        setDbConnectionStatus(success ? 'connected' : 'error');
      })
      .catch(() => {
        setDbConnectionStatus('error');
      });
  }, []);

  const activeChallenge = getActiveChallenge();

  // Initialize notification system
  useNotificationManager({ activeChallenge, userSettings });

  const todayProgress = activeChallenge ? getTodayProgress(activeChallenge.id) || null : null;
  const challengeProgress = activeChallenge ? getChallengeProgressData(activeChallenge.id) : [];
  const challengeReflections = activeChallenge ? getChallengeReflections(activeChallenge.id) : [];

  const handleCreateChallenge = (challengeData: Parameters<typeof createChallenge>[0]) => {
    const today = new Date();
    const startDate = new Date(challengeData.startDate);
    const isFutureDate = startDate > today;
    
    // Set proper status: active if starting today, draft if future date
    const finalChallengeData = {
      ...challengeData,
      status: (isFutureDate ? 'draft' : 'active') as Challenge['status']
    };
    
    createChallenge(finalChallengeData);
    setShowCreateModal(false);
    setActiveTab('dashboard');
    
    // Show success toast notification
    if (isFutureDate) {
      // Challenge will start on the specified date
      toast.success(`🎯 Challenge "${challengeData.name}" created! It will start on ${new Date(challengeData.startDate).toLocaleDateString()}`, {
        duration: 4000,
        position: 'top-center',
      });
    } else {
      // Challenge started immediately
      toast.success(`🚀 Challenge "${challengeData.name}" created and started!`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <MultiChallengeDashboard
            challenges={challenges}
            todayProgress={todayProgress}
            onNavigate={setActiveTab}
            videoCount={challengeReflections.length}
            onUpdateChallenge={updateChallenge}
            onOpenCreateModal={() => setShowCreateModal(true)}
          />
        );
      
      case 'tasks':
        return (
          <TaskManager
            activeChallenge={activeChallenge}
            todayProgress={todayProgress}
            onUpdateTask={updateTask}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onRecordProgress={recordDailyProgress}
          />
        );
      
      case 'video':
        return (
          <VideoReflectionLog
            activeChallenge={activeChallenge}
            videoReflections={challengeReflections}
            onAddReflection={addVideoReflection}
          />
        );
      
      case 'progress':
        return (
          <ProgressAnalytics
            activeChallenge={activeChallenge}
            challengeProgress={challengeProgress}
          />
        );
      
      case 'challenges':
        return (
          <ChallengeManager
            challenges={challenges}
            activeChallenge={activeChallenge}
            userProfile={userProfile}
            onCreateChallenge={createChallenge}
            onUpdateChallenge={updateChallenge}
            onDeleteChallenge={deleteChallenge}
            onNavigate={setActiveTab}
            onOpenCreateModal={() => setShowCreateModal(true)}
          />
        );
      
      case 'create':
        return null; // Modal will handle this now
      
      default:
        return (
          <MultiChallengeDashboard
            challenges={challenges}
            todayProgress={todayProgress}
            onNavigate={setActiveTab}
            videoCount={challengeReflections.length}
            onUpdateChallenge={updateChallenge}
            onOpenCreateModal={() => setShowCreateModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header
        activeChallenge={activeChallenge}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Database Status Indicator (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className={`mb-4 p-3 rounded-xl text-sm shadow-lg backdrop-blur-sm border ${
            dbConnectionStatus === 'connected' 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-300' 
              : dbConnectionStatus === 'error'
              ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white border-red-300'
              : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-yellow-300'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="font-medium">Database Status:</span>
              {
                dbConnectionStatus === 'connected' ? '✨ Connected & Ready' :
                dbConnectionStatus === 'error' ? '⚠️ Connection Error' :
                '🔄 Checking Connection...'
              }
            </div>
            {error && (
              <div className="mt-2 p-2 bg-white/20 rounded-lg">
                <span className="font-medium">Error Details:</span> {error}
              </div>
            )}
          </div>
        )}
        
        {renderContent()}
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Create Challenge Modal */}
      {showCreateModal && userProfile && (
        <StepByChallengeCreator
          onCreateChallenge={handleCreateChallenge}
          onCancel={() => setShowCreateModal(false)}
          userProfile={userProfile}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          userSettings={userSettings}
          userProfile={userProfile}
          onSaveSettings={saveSettings}
          onSaveUserProfile={saveUserProfile}
          onExportData={exportAllData}
          onImportData={importData}
          onClearAllData={clearAllData}
        />
      )}
      
      {/* Toast Container */}
      <Toaster />
    </div>
  );
}

export default App;