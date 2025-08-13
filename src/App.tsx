import { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import TaskManager from './components/Tasks/TaskManager';
import VideoReflectionLog from './components/Video/VideoReflectionLog';
import ProgressAnalytics from './components/Progress/ProgressAnalytics';
import ChallengeManager from './components/Challenges/ChallengeManager';
import ChallengeCreator from './components/Create/ChallengeCreator';
import Settings from './components/Settings/Settings';
import { useDatabaseManager } from './hooks/useDatabaseManager';
import { DatabaseConnectionTest } from './utils/databaseTest';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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

  const todayProgress = activeChallenge ? getTodayProgress(activeChallenge.id) || null : null;
  const challengeProgress = activeChallenge ? getChallengeProgressData(activeChallenge.id) : [];
  const challengeReflections = activeChallenge ? getChallengeReflections(activeChallenge.id) : [];

  const handleCreateChallenge = (challengeData: Parameters<typeof createChallenge>[0]) => {
    createChallenge(challengeData);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            activeChallenge={activeChallenge}
            todayProgress={todayProgress}
            onNavigate={setActiveTab}
            videoCount={challengeReflections.length}
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
            onCreateChallenge={createChallenge}
            onUpdateChallenge={updateChallenge}
            onDeleteChallenge={deleteChallenge}
            onNavigate={setActiveTab}
          />
        );
      
      case 'create':
        return (
          <ChallengeCreator
            onCreateChallenge={handleCreateChallenge}
            onCancel={() => setActiveTab('dashboard')}
          />
        );
      
      default:
        return <DashboardOverview activeChallenge={activeChallenge} todayProgress={todayProgress} onNavigate={setActiveTab} videoCount={challengeReflections.length} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Database Status Indicator (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className={`mb-4 p-2 rounded-lg text-sm ${
            dbConnectionStatus === 'connected' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : dbConnectionStatus === 'error'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }`}>
            Database Status: {
              dbConnectionStatus === 'connected' ? '✅ Connected' :
              dbConnectionStatus === 'error' ? '❌ Connection Error' :
              '🔄 Checking...'
            }
            {error && ` - Error: ${error}`}
          </div>
        )}
        
        {renderContent()}
      </main>

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
    </div>
  );
}

export default App;