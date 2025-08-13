import React, { useState, useEffect } from 'react';
import { Heart, Target, Zap } from 'lucide-react';

interface CommitmentModalProps {
  userName: string;
  challengeName: string;
  isOpen: boolean;
  onCommit: () => void;
  onCancel: () => void;
}

const CommitmentModal: React.FC<CommitmentModalProps> = ({
  userName,
  challengeName,
  isOpen,
  onCommit,
  onCancel
}) => {
  const [commitmentText, setCommitmentText] = useState('');
  const [isCommitted, setIsCommitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCommitmentText('');
      setIsCommitted(false);
    }
  }, [isOpen]);

  const handleCommit = () => {
    if (commitmentText.trim().length >= 10) {
      setIsCommitted(true);
      setTimeout(() => {
        onCommit();
      }, 2000); // Show success message for 2 seconds
    }
  };

  if (!isOpen) return null;

  if (isCommitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center mb-20 md:mb-0">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Let's Do This! 🚀
            </h2>
            <p className="text-gray-600">
              Your commitment has been recorded, {userName}!
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">
              "{commitmentText}"
            </p>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Starting your challenge in 2 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] flex flex-col mb-20 md:mb-0">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Ready to Commit, {userName}?
            </h2>
            <p className="text-gray-600 text-sm">
              You're about to start "<strong>{challengeName}</strong>". 
              Write your commitment to make it official!
            </p>
            {userName === 'Challenger' && (
              <p className="text-orange-600 text-xs mt-2 bg-orange-50 p-2 rounded-lg border border-orange-200">
                💡 Tip: Set up your profile in Settings for a personalized experience!
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Personal Commitment *
            </label>
            <textarea
              value={commitmentText}
              onChange={(e) => setCommitmentText(e.target.value)}
              placeholder="I commit to completing this challenge because..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 10 characters ({commitmentText.length}/10)
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Your Challenge Commitment:</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• I will dedicate time daily to this challenge</li>
              <li>• I will track my progress honestly</li>
              <li>• I will persist through difficult days</li>
              <li>• I will celebrate small wins along the way</li>
            </ul>
          </div>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex-shrink-0 p-6 border-t bg-white rounded-b-lg">
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCommit}
              disabled={commitmentText.trim().length < 10}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              I Commit! 💪
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitmentModal;
