import React, { useState } from 'react';
import { Calendar, CheckCircle, Video, TrendingUp, Target, Award, ChevronRight, Play, Pause, RotateCcw, Plus } from 'lucide-react';
import { Challenge, DailyProgress } from '../../types';
import { getCurrentDay, getChallengeDaysRemaining } from '../../utils/dateUtils';

interface MultiChallengeDashboardProps {
  challenges: Challenge[];
  todayProgress: DailyProgress | null;
  onNavigate: (tab: string) => void;
  videoCount: number;
  onUpdateChallenge: (challengeId: string, updates: Partial<Challenge>) => void;
  onOpenCreateModal?: () => void;
}

const MultiChallengeDashboard: React.FC<MultiChallengeDashboardProps> = ({
  challenges,
  todayProgress,
  onNavigate,
  videoCount,
  onUpdateChallenge,
  onOpenCreateModal,
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const draftChallenges = challenges.filter(c => c.status === 'draft');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

  const selectedChallenge = selectedChallengeId 
    ? challenges.find(c => c.id === selectedChallengeId) 
    : activeChallenges[0] || null;

  if (challenges.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">No Challenges Yet</h2>
        <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Create your first challenge to get started!</p>
        <button
          onClick={() => onOpenCreateModal ? onOpenCreateModal() : onNavigate('create')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline" />
          Create Challenge
        </button>
      </div>
    );
  }

  const handleChallengeAction = (challenge: Challenge, action: 'start' | 'pause' | 'resume') => {
    let newStatus: Challenge['status'] = challenge.status;
    
    switch (action) {
      case 'start':
        newStatus = 'active';
        break;
      case 'pause':
        newStatus = 'paused';
        break;
      case 'resume':
        newStatus = 'active';
        break;
    }
    
    onUpdateChallenge(challenge.id, { status: newStatus });
  };

  const getChallengeStatusColor = (status: Challenge['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderChallengeCard = (challenge: Challenge, isSelected = false) => {
    const currentDay = getCurrentDay(challenge.startDate);
    const daysRemaining = getChallengeDaysRemaining(challenge.startDate, challenge.totalDays);
    const completionPercentage = isSelected ? (todayProgress?.completionPercentage || 0) : 0;
    const challengeProgress = Math.round((currentDay / challenge.totalDays) * 100);

    return (
      <div
        key={challenge.id}
        className={`rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
          isSelected 
            ? 'bg-white border-2 shadow-2xl ring-4 ring-opacity-20' 
            : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl'
        }`}
        onClick={() => setSelectedChallengeId(challenge.id)}
        style={isSelected ? { 
          borderColor: challenge.color
        } : { 
          borderLeftColor: challenge.color, 
          borderLeftWidth: '6px',
          borderLeftStyle: 'solid'
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: challenge.color }}
              />
              <h3 className={`font-bold text-xl ${isSelected ? 'text-gray-800' : 'text-gray-800'}`}>{challenge.name}</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                isSelected ? 'text-white shadow-sm' : `${getChallengeStatusColor(challenge.status)} shadow-sm`
              }`}
              style={isSelected ? { backgroundColor: challenge.color } : {}}
              >
                {challenge.status.toUpperCase()} ✨
              </span>
            </div>
            {challenge.description && (
              <p className={`text-sm mb-3 ${isSelected ? 'text-gray-600' : 'text-gray-600'}`}>
                {challenge.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {challenge.status === 'draft' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChallengeAction(challenge, 'start');
                }}
                className={`p-3 rounded-xl transition-all duration-200 shadow-lg ${
                  isSelected 
                    ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm' 
                    : 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white transform hover:scale-110'
                }`}
              >
                <Play className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white'}`} />
              </button>
            )}
            {challenge.status === 'active' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChallengeAction(challenge, 'pause');
                }}
                className={`p-3 rounded-xl transition-all duration-200 shadow-lg ${
                  isSelected 
                    ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white transform hover:scale-110'
                }`}
              >
                <Pause className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white'}`} />
              </button>
            )}
            {challenge.status === 'paused' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChallengeAction(challenge, 'resume');
                }}
                className={`p-3 rounded-xl transition-all duration-200 shadow-lg ${
                  isSelected 
                    ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm' 
                    : 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white transform hover:scale-110'
                }`}
              >
                <RotateCcw className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white'}`} />
              </button>
            )}
          </div>
        </div>

        {challenge.status === 'active' && (
          <>
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div>
                <div className={`text-lg font-bold ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
                  {currentDay}
                </div>
                <div className={`text-xs ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                  Current Day
                </div>
              </div>
              <div>
                <div className={`text-lg font-bold ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
                  {daysRemaining}
                </div>
                <div className={`text-xs ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                  Days Left
                </div>
              </div>
              <div>
                <div className={`text-lg font-bold ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
                  {isSelected ? completionPercentage : challengeProgress}%
                </div>
                <div className={`text-xs ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                  {isSelected ? 'Today' : 'Complete'}
                </div>
              </div>
            </div>

            <div className={`w-full rounded-full h-2 ${
              isSelected ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              <div 
                className={`rounded-full h-2 transition-all duration-300 ${
                  isSelected ? 'bg-white' : 'bg-blue-500'
                }`}
                style={{ width: `${isSelected ? completionPercentage : challengeProgress}%` }}
              />
            </div>
          </>
        )}

        {challenge.status === 'draft' && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {challenge.tasks.length} tasks • {challenge.totalDays} days
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="bg-gradient-to-r from-white to-blue-50 p-4 rounded-2xl border-2 border-blue-100 shadow-lg w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard ✨
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {activeChallenges.length} active
            </span>
            <span className="mx-2">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              {draftChallenges.length} draft
            </span>
            <span className="mx-2">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              {completedChallenges.length} completed
            </span>
          </p>
        </div>
        <button
          onClick={() => onOpenCreateModal ? onOpenCreateModal() : onNavigate('create')}
          className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-xl transform hover:scale-105 font-medium text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
          New Challenge 🚀
        </button>
      </div>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Active Challenges</h2>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {activeChallenges.map(challenge => 
              renderChallengeCard(challenge, challenge.id === selectedChallenge?.id)
            )}
          </div>
        </div>
      )}

      {/* Today's Focus (for selected challenge) */}
      {selectedChallenge && selectedChallenge.status === 'active' && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Today's Focus</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <button 
              onClick={() => onNavigate('tasks')}
              className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 text-left text-white transform hover:scale-105 border border-white/20"
            >
              <div className="bg-white/20 p-3 rounded-xl w-fit mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-lg">Daily Tasks</div>
              <div className="text-blue-100 text-sm">
                {todayProgress?.completedTasks.length || 0}/{selectedChallenge.tasks.length} completed ✨
              </div>
            </button>
            
            <button 
              onClick={() => onNavigate('video')}
              className="bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 text-left text-white transform hover:scale-105 border border-white/20"
            >
              <div className="bg-white/20 p-3 rounded-xl w-fit mb-3">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-lg">Daily Logs</div>
              <div className="text-red-100 text-sm">{videoCount} videos recorded 🎥</div>
            </button>
            
            <button 
              onClick={() => onNavigate('progress')}
              className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 text-left text-white transform hover:scale-105 border border-white/20"
            >
              <div className="bg-white/20 p-3 rounded-xl w-fit mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-lg">Progress</div>
              <div className="text-green-100 text-sm">View analytics 📊</div>
            </button>

            <button 
              onClick={() => onNavigate('challenges')}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 text-left text-white transform hover:scale-105 border border-white/20"
            >
              <div className="bg-white/20 p-3 rounded-xl w-fit mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-lg">All Challenges</div>
              <div className="text-purple-100 text-sm">Manage collection 🎯</div>
            </button>
          </div>
        </div>
      )}

      {/* Draft Challenges */}
      {draftChallenges.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Draft Challenges</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {draftChallenges.map(challenge => renderChallengeCard(challenge))}
          </div>
        </div>
      )}

      {/* Motivational Section */}
      {selectedChallenge && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Keep Going! 💪</h3>
              <p className="text-sm text-gray-600">You're on day {getCurrentDay(selectedChallenge.startDate)} of your journey</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-500">
                {Math.round((getCurrentDay(selectedChallenge.startDate) / selectedChallenge.totalDays) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((getCurrentDay(selectedChallenge.startDate) / selectedChallenge.totalDays) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Recent Tasks Section */}
      {selectedChallenge && selectedChallenge.tasks && selectedChallenge.tasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Today's Tasks
            </h2>
            <div className="text-sm text-gray-500">
              {todayProgress?.completedTasks.length || 0} of {selectedChallenge.tasks.length} completed
            </div>
          </div>
          
          <div className="space-y-3">
            {selectedChallenge.tasks.slice(0, 4).map((task) => {
              const isCompleted = todayProgress?.completedTasks.includes(task.id);
              return (
                <div 
                  key={task.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${isCompleted ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                      {task.name}
                    </div>
                    {task.description && (
                      <div className={`text-sm ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                        {task.description}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              );
            })}
            
            {selectedChallenge.tasks.length > 4 && (
              <button
                onClick={() => onNavigate('tasks')}
                className="w-full mt-3 py-2 text-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                View all {selectedChallenge.tasks.length} tasks →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{challenges.length}</div>
            <div className="text-sm text-gray-600">Total Challenges</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{completedChallenges.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {todayProgress?.completedTasks.length || 0}
            </div>
            <div className="text-sm text-gray-600">Tasks Today</div>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <Video className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{videoCount}</div>
            <div className="text-sm text-gray-600">Video Logs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiChallengeDashboard;
