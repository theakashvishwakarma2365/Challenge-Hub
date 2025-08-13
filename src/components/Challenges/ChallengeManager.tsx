import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Play, Pause, Calendar, Target, Clock, FileText, Download } from 'lucide-react';
import { Challenge, CommitmentLetter } from '../../types';
import { formatDate, getDaysBetween, getCurrentDay, getDaysRemaining } from '../../utils/dateUtils';
import { generateCommitmentLetter, downloadCommitmentLetter } from '../../utils/exportUtils';

interface ChallengeManagerProps {
  challenges: Challenge[];
  activeChallenge: Challenge | null;
  onCreateChallenge: (challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt' | 'currentDay'>) => void;
  onUpdateChallenge: (id: string, updates: Partial<Challenge>) => void;
  onDeleteChallenge: (id: string) => void;
  onNavigate: (tab: string) => void;
}

const ChallengeManager: React.FC<ChallengeManagerProps> = ({
  challenges,
  activeChallenge,
  onCreateChallenge,
  onUpdateChallenge,
  onDeleteChallenge,
  onNavigate,
}) => {
  const [showCommitmentModal, setShowCommitmentModal] = useState<Challenge | null>(null);

  const handleStatusChange = (challengeId: string, newStatus: Challenge['status']) => {
    // If setting to active, deactivate other challenges
    if (newStatus === 'active') {
      challenges.forEach(challenge => {
        if (challenge.id !== challengeId && challenge.status === 'active') {
          onUpdateChallenge(challenge.id, { status: 'paused' });
        }
      });
    }
    onUpdateChallenge(challengeId, { status: newStatus });
  };

  const getStatusColor = (status: Challenge['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadCommitment = (challenge: Challenge) => {
    const commitmentLetter = generateCommitmentLetter(challenge);
    downloadCommitmentLetter(commitmentLetter, challenge.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Challenge Management</h2>
        <button
          onClick={() => onNavigate('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Challenge
        </button>
      </div>

      {/* Active Challenge Highlight */}
      {activeChallenge && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{activeChallenge.name}</h3>
              <p className="opacity-90 mb-2">{activeChallenge.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>Day {getCurrentDay(activeChallenge.startDate)} of {activeChallenge.totalDays}</span>
                <span>{getDaysRemaining(activeChallenge.endDate)} days remaining</span>
                <span>{activeChallenge.tasks.length} tasks</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCommitmentModal(activeChallenge)}
                className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Commitment
              </button>
              <button
                onClick={() => handleDownloadCommitment(activeChallenge)}
                className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge List */}
      <div className="grid gap-4">
        {challenges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Challenges Yet</h3>
            <p className="text-gray-500 mb-6">Create your first challenge to start your journey!</p>
            <button
              onClick={() => onNavigate('create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Challenge
            </button>
          </div>
        ) : (
          challenges.map((challenge) => {
            const currentDay = getCurrentDay(challenge.startDate);
            const daysRemaining = getDaysRemaining(challenge.endDate);
            const progressPercentage = Math.round((currentDay / challenge.totalDays) * 100);

            return (
              <div key={challenge.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{challenge.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
                        {challenge.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{challenge.description}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(challenge.startDate, 'MMM dd')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{challenge.totalDays} days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{challenge.tasks.length} tasks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600 font-medium">{progressPercentage}% complete</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>

                    {/* Rules Preview */}
                    {challenge.rules.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Rules: </span>
                        <span>{challenge.rules[0]}</span>
                        {challenge.rules.length > 1 && (
                          <span className="text-gray-400"> +{challenge.rules.length - 1} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex gap-2">
                      {challenge.status === 'active' ? (
                        <button
                          onClick={() => handleStatusChange(challenge.id, 'paused')}
                          className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 flex items-center gap-2 transition-colors"
                        >
                          <Pause className="w-4 h-4" />
                          Pause
                        </button>
                      ) : challenge.status === 'paused' ? (
                        <button
                          onClick={() => handleStatusChange(challenge.id, 'active')}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Resume
                        </button>
                      ) : challenge.status === 'draft' ? (
                        <button
                          onClick={() => handleStatusChange(challenge.id, 'active')}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Start
                        </button>
                      ) : null}

                      <button
                        onClick={() => setShowCommitmentModal(challenge)}
                        className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        View
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadCommitment(challenge)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                      
                      <button
                        onClick={() => onDeleteChallenge(challenge.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Commitment Modal */}
      {showCommitmentModal && (
        <CommitmentModal
          challenge={showCommitmentModal}
          onClose={() => setShowCommitmentModal(null)}
          onDownload={() => {
            handleDownloadCommitment(showCommitmentModal);
            setShowCommitmentModal(null);
          }}
        />
      )}
    </div>
  );
};

// Commitment Modal Component
interface CommitmentModalProps {
  challenge: Challenge;
  onClose: () => void;
  onDownload: () => void;
}

const CommitmentModal: React.FC<CommitmentModalProps> = ({ challenge, onClose, onDownload }) => {
  const commitmentLetter = generateCommitmentLetter(challenge);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Commitment Letter</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 modal-scroll">
          <div className="bg-gray-50 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
              {commitmentLetter.content}
            </pre>
          </div>
        </div>
        
        <div className="p-6 border-t bg-white">
          <div className="flex gap-3">
            <button 
              onClick={onDownload}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download as Text File
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeManager;