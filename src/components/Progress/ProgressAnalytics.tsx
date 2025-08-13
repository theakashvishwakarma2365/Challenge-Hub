import React from 'react';
import { TrendingUp, Calendar, Target, Award, BarChart3, Activity } from 'lucide-react';
import { Challenge, DailyProgress } from '../../types';
import { getCurrentDay, getDaysRemaining, getDateRange } from '../../utils/dateUtils';

interface ProgressAnalyticsProps {
  activeChallenge: Challenge | null;
  challengeProgress: DailyProgress[];
}

const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  activeChallenge,
  challengeProgress,
}) => {
  if (!activeChallenge) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">No Active Challenge</h2>
        <p className="text-gray-500">Select or create a challenge to view progress analytics.</p>
      </div>
    );
  }

  const currentDay = getCurrentDay(activeChallenge.startDate);
  const daysRemaining = getDaysRemaining(activeChallenge.endDate);
  const challengeProgressPercentage = Math.round((currentDay / activeChallenge.totalDays) * 100);
  
  // Calculate average completion rate
  const averageCompletion = challengeProgress.length > 0
    ? Math.round(challengeProgress.reduce((sum, day) => sum + day.completionPercentage, 0) / challengeProgress.length)
    : 0;

  // Calculate streak
  const currentStreak = calculateCurrentStreak(challengeProgress);
  const longestStreak = calculateLongestStreak(challengeProgress);

  // Get mood trend
  const averageMood = challengeProgress.length > 0
    ? (challengeProgress.reduce((sum, day) => sum + day.mood, 0) / challengeProgress.length).toFixed(1)
    : '0';

  // Generate calendar data
  const calendarDates = getDateRange(activeChallenge.startDate, activeChallenge.totalDays);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Progress Analytics</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{currentDay}</div>
          <div className="text-gray-600 text-sm">Days Completed</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{challengeProgressPercentage}%</div>
          <div className="text-gray-600 text-sm">Challenge Progress</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{averageCompletion}%</div>
          <div className="text-gray-600 text-sm">Avg. Daily Completion</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">{currentStreak}</div>
          <div className="text-gray-600 text-sm">Current Streak</div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Daily Progress Trend
        </h3>
        
        {challengeProgress.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No progress data yet</p>
            <p className="text-sm">Complete some tasks to see your progress trend!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Simple bar chart */}
            <div className="flex items-end gap-2 h-32 overflow-x-auto pb-2">
              {challengeProgress
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((day, index) => (
                  <div key={day.id} className="flex flex-col items-center gap-1 min-w-0">
                    <div
                      className="bg-blue-500 rounded-t min-w-6 transition-all duration-300 hover:bg-blue-600"
                      style={{ 
                        height: `${Math.max(day.completionPercentage * 0.8, 4)}px`,
                        width: '24px'
                      }}
                      title={`Day ${index + 1}: ${day.completionPercentage}%`}
                    />
                    <div className="text-xs text-gray-500 transform -rotate-45 origin-top-left whitespace-nowrap">
                      {new Date(day.date).getDate()}
                    </div>
                  </div>
                ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        )}
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Challenge Calendar
        </h3>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {calendarDates.map((date, index) => {
            const dayNumber = index + 1;
            const isCurrentDay = dayNumber === currentDay;
            const isCompleted = dayNumber < currentDay;
            const dayProgress = challengeProgress.find(p => 
              new Date(p.date).toDateString() === date.toDateString()
            );
            
            let bgColor = 'bg-gray-100 text-gray-400';
            if (isCurrentDay) {
              bgColor = 'bg-blue-500 text-white';
            } else if (isCompleted && dayProgress) {
              if (dayProgress.completionPercentage >= 80) {
                bgColor = 'bg-green-500 text-white';
              } else if (dayProgress.completionPercentage >= 50) {
                bgColor = 'bg-yellow-500 text-white';
              } else {
                bgColor = 'bg-red-500 text-white';
              }
            } else if (isCompleted) {
              bgColor = 'bg-gray-300 text-gray-600';
            }
            
            return (
              <div 
                key={index}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors cursor-pointer hover:opacity-80 ${bgColor}`}
                title={dayProgress ? `Day ${dayNumber}: ${dayProgress.completionPercentage}% complete` : `Day ${dayNumber}`}
              >
                {dayNumber}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Current Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Excellent (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Good (50-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Needs Work (&lt;50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span>Incomplete</span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-semibold">{currentStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Longest Streak</span>
              <span className="font-semibold">{longestStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Mood</span>
              <span className="font-semibold">{averageMood}/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Days Remaining</span>
              <span className="font-semibold">{daysRemaining} days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Performance Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Tasks</span>
              <span className="font-semibold">{activeChallenge.tasks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Days Active</span>
              <span className="font-semibold">{challengeProgress.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold">{averageCompletion}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Challenge Type</span>
              <span className="font-semibold capitalize">{activeChallenge.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function calculateCurrentStreak(progress: DailyProgress[]): number {
  if (progress.length === 0) return 0;
  
  const sortedProgress = progress
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streak = 0;
  for (const day of sortedProgress) {
    if (day.completionPercentage >= 70) { // Consider 70%+ as a successful day
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateLongestStreak(progress: DailyProgress[]): number {
  if (progress.length === 0) return 0;
  
  const sortedProgress = progress
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let longestStreak = 0;
  let currentStreak = 0;
  
  for (const day of sortedProgress) {
    if (day.completionPercentage >= 70) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return longestStreak;
}

export default ProgressAnalytics;