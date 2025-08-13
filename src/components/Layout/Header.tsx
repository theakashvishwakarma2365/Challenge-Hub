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
    <div className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Challenge Hub</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            {activeChallenge && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Current Challenge</div>
                <div className="font-semibold text-gray-800 truncate max-w-48">
                  {activeChallenge.name}
                </div>
              </div>
            )}
            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
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