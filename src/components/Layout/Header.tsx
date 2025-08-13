import React from 'react';
import { Award, Settings, Menu, X } from 'lucide-react';
import { Challenge } from '../../types';

interface HeaderProps {
  activeChallenge: Challenge | null;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeChallenge,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onSettingsClick,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-xl border-b sticky top-0 z-40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Challenge Hub
              <span className="text-blue-200 text-sm ml-2">✨</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            {activeChallenge && (
              <div className="text-right bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-sm text-blue-200">Current Challenge</div>
                <div className="font-semibold text-white truncate max-w-48">
                  {activeChallenge.name}
                </div>
              </div>
            )}
            <button
              onClick={onSettingsClick}
              className="p-3 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onSettingsClick}
              className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;