import React from 'react';
import { Calendar, CheckCircle, Video, FileText, TrendingUp, Target, Award, Clock } from 'lucide-react';
import { Challenge, DailyProgress } from '../../types';
import { getCurrentDay, getChallengeDaysRemaining } from '../../utils/dateUtils';

interface DashboardOverviewProps {
  activeChallenge: Challenge | null;
  todayProgress: DailyProgress | null;
  onNavigate: (tab: string) => void;
  videoCount: number;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  activeChallenge,
  todayProgress,
  onNavigate,
  videoCount,
}) => {
  if (!activeChallenge) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">No Active Challenge</h2>
        <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Create your first challenge to get started!</p>
        <button
          onClick={() => onNavigate('create')}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Create Challenge
        </button>
      </div>
    );
  }

  const currentDay = getCurrentDay(activeChallenge.startDate);
  const daysRemaining = getChallengeDaysRemaining(activeChallenge.startDate, activeChallenge.totalDays);
  const completionPercentage = todayProgress?.completionPercentage || 0;
  const challengeProgress = Math.round((currentDay / activeChallenge.totalDays) * 100);

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Challenge Overview Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{activeChallenge.name}</h2>
            <p className="opacity-90 text-sm sm:text-base">Day {currentDay} of {activeChallenge.totalDays}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-bold">{completionPercentage}%</div>
            <div className="text-xs sm:text-sm opacity-90">Today's Progress</div>
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <div className="text-lg sm:text-xl font-bold">{currentDay}</div>
            <div className="text-xs opacity-90">Current Day</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold">{daysRemaining}</div>
            <div className="text-xs opacity-90">Days Left</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold">{challengeProgress}%</div>
            <div className="text-xs opacity-90">Complete</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button 
          onClick={() => onNavigate('tasks')}
          className="bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 text-left"
        >
          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mb-1 sm:mb-2" />
          <div className="font-semibold text-sm sm:text-base">Daily Tasks</div>
          <div className="text-xs sm:text-sm text-gray-600">
            {todayProgress?.completedTasks.length || 0}/{activeChallenge.tasks.length} done
          </div>
        </button>
        
        <button 
          onClick={() => onNavigate('video')}
          className="bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500 text-left"
        >
          <Video className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mb-1 sm:mb-2" />
          <div className="font-semibold text-sm sm:text-base">Daily Logs</div>
          <div className="text-xs sm:text-sm text-gray-600">{videoCount} recorded</div>
        </button>
        
        <button 
          onClick={() => onNavigate('progress')}
          className="bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500 text-left"
        >
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mb-1 sm:mb-2" />
          <div className="font-semibold text-sm sm:text-base">Progress</div>
          <div className="text-xs sm:text-sm text-gray-600">Track trends</div>
        </button>
        
        <button 
          onClick={() => onNavigate('challenges')}
          className="bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500 text-left"
        >
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-1 sm:mb-2" />
          <div className="font-semibold text-sm sm:text-base">Challenges</div>
          <div className="text-xs sm:text-sm text-gray-600">Manage all</div>
        </button>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          Today's Schedule
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {activeChallenge.tasks.length === 0 ? (
            <div className="text-center text-gray-500 py-3 sm:py-4">
              <p className="text-sm sm:text-base">No tasks scheduled for today</p>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm mt-2"
              >
                Add some tasks →
              </button>
            </div>
          ) : (
            activeChallenge.tasks
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((task) => {
                const isCompleted = todayProgress?.completedTasks.includes(task.id) || false;
                return (
                  <div key={task.id} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-3 rounded-lg hover:bg-gray-50">
                    <div className="text-xs sm:text-sm text-gray-500 w-12 sm:w-16 mt-1">{task.time}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1">
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isCompleted 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300'
                          }`}
                        >
                          {isCompleted && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </div>
                        <span className={`text-sm sm:text-base flex-1 min-w-0 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pl-7 sm:pl-9">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-600' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;