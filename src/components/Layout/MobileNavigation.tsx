import React from 'react';
import { Target, CheckCircle, Video, TrendingUp, Calendar, Home } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'dashboard', name: 'Home', icon: Home },
    { id: 'tasks', name: 'Tasks', icon: CheckCircle },
    { id: 'challenges', name: 'Challenges', icon: Calendar },
    { id: 'progress', name: 'Progress', icon: TrendingUp },
    { id: 'video', name: 'Daily Log', icon: Video },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 border-t border-white/20 md:hidden z-50 backdrop-blur-lg shadow-2xl">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-white bg-white/20 transform scale-105 shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.id === 'create' ? (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center shadow-lg">
                  <Icon className="w-5 h-5" />
                </div>
              ) : (
                <Icon className="w-6 h-6 mb-1" />
              )}
              <span className="text-xs font-medium">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
