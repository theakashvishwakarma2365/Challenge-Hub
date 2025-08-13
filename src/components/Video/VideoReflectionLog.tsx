import React, { useState } from 'react';
import { Video, Play, Plus, Calendar, MessageCircle, Star } from 'lucide-react';
import { Challenge, VideoReflection, ReflectionQuestion } from '../../types';

interface VideoReflectionLogProps {
  activeChallenge: Challenge | null;
  videoReflections: VideoReflection[];
  onAddReflection: (reflection: Omit<VideoReflection, 'id'>) => void;
}

const VideoReflectionLog: React.FC<VideoReflectionLogProps> = ({
  activeChallenge,
  videoReflections,
  onAddReflection,
}) => {
  const [showAddReflection, setShowAddReflection] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<VideoReflection | null>(null);

  const defaultQuestions = [
    { id: '1', question: 'Did you work for your health today?', answer: '', type: 'boolean' as const },
    { id: '2', question: 'What new thing did you learn today?', answer: '', type: 'text' as const },
    { id: '3', question: 'Have you completed your planned tasks?', answer: '', type: 'boolean' as const },
    { id: '4', question: 'What challenges did you face and how did you overcome them?', answer: '', type: 'text' as const },
    { id: '5', question: 'How do you feel about your progress today?', answer: '', type: 'rating' as const },
    { id: '6', question: 'What will you do differently tomorrow?', answer: '', type: 'text' as const },
  ];

  if (!activeChallenge) {
    return (
      <div className="text-center py-12">
        <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">No Active Challenge</h2>
        <p className="text-gray-500">Select or create a challenge to start recording reflections.</p>
      </div>
    );
  }

  const challengeReflections = videoReflections.filter(v => v.challengeId === activeChallenge.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Daily Logs</h2>
        <button
          onClick={() => setShowAddReflection(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Today's Log
        </button>
      </div>

      {/* Reflection Questions Guide */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Daily Reflection Questions
        </h3>
        <div className="space-y-3 text-gray-700">
          {defaultQuestions.map((question, index) => (
            <div key={question.id} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold mt-0.5 flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-sm sm:text-base">{question.question}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Answer these questions honestly each day to track your progress. 
            This daily practice will help you stay accountable and reflect on your growth over time.
          </p>
        </div>
      </div>

      {/* Daily Logs History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Daily Logs History
        </h3>
        
        {challengeReflections.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium mb-2">No daily logs recorded yet</p>
            <p className="text-sm">Start recording your daily reflections to track your journey!</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            {challengeReflections
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((reflection) => (
                <div key={reflection.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 border border-gray-100">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-red-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">Day {reflection.day} Daily Log</h4>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < reflection.mood ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(reflection.date).toLocaleDateString()} • {Math.floor(reflection.duration / 60)}:{(reflection.duration % 60).toString().padStart(2, '0')} min
                    </div>
                    {reflection.notes && (
                      <p className="text-sm text-gray-600 truncate">{reflection.notes}</p>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setShowDetailsModal(reflection)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add Reflection Modal */}
      {showAddReflection && (
        <ReflectionModal
          challengeId={activeChallenge.id}
          currentDay={activeChallenge.currentDay}
          questions={defaultQuestions}
          onSave={(reflection) => {
            onAddReflection(reflection);
            setShowAddReflection(false);
          }}
          onCancel={() => setShowAddReflection(false)}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <DetailsModal
          reflection={showDetailsModal}
          onClose={() => setShowDetailsModal(null)}
        />
      )}
    </div>
  );
};

// Reflection Modal Component
interface ReflectionModalProps {
  challengeId: string;
  currentDay: number;
  questions: ReflectionQuestion[];
  onSave: (reflection: Omit<VideoReflection, 'id'>) => void;
  onCancel: () => void;
}

const ReflectionModal: React.FC<ReflectionModalProps> = ({
  challengeId,
  currentDay,
  questions,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    duration: 180, // 3 minutes default
    mood: 3 as 1 | 2 | 3 | 4 | 5,
    notes: '',
    questions: questions.map(q => ({ ...q, answer: '' })),
  });

  const handleQuestionChange = (questionId: string, answer: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, answer } : q
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reflection: Omit<VideoReflection, 'id'> = {
      challengeId,
      day: currentDay,
      date: new Date().toISOString(),
      duration: formData.duration,
      questions: formData.questions,
      notes: formData.notes,
      mood: formData.mood,
    };

    onSave(reflection);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 overflow-y-auto flex-1 modal-scroll">
          <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white z-10 pb-2 border-b">Record Day {currentDay} Daily Log</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Questions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Reflection Questions</h3>
              {formData.questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {index + 1}. {question.question}
                  </label>
                  
                  {question.type === 'text' && (
                    <textarea
                      value={question.answer}
                      onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Your answer..."
                    />
                  )}
                  
                  {question.type === 'boolean' && (
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="yes"
                          checked={question.answer === 'yes'}
                          onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="no"
                          checked={question.answer === 'no'}
                          onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  )}
                  
                  {question.type === 'rating' && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleQuestionChange(question.id, rating.toString())}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                            question.answer === rating.toString()
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Spent on Reflection (seconds)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 180 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="30"
                max="600"
              />
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How do you feel today?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood: mood as 1 | 2 | 3 | 4 | 5 })}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        mood <= formData.mood ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                    <span className="text-xs text-gray-600">{mood}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Any additional thoughts or observations..."
              />
            </div>
          </form>
        </div>
        
        {/* Fixed footer with buttons */}
        <div className="p-6 border-t bg-white">
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Save Daily Log
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Details Modal Component
interface DetailsModalProps {
  reflection: VideoReflection;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ reflection, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Day {reflection.day} Daily Log Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 modal-scroll">
          {/* Date and Duration */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Date:</span>
                <p className="text-gray-900">{new Date(reflection.date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <p className="text-gray-900">{Math.floor(reflection.duration / 60)}:{(reflection.duration % 60).toString().padStart(2, '0')} min</p>
              </div>
            </div>
          </div>

          {/* Mood */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Mood Rating</h3>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < reflection.mood ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600">({reflection.mood}/5)</span>
            </div>
          </div>

          {/* Questions and Answers */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Reflection Questions</h3>
            <div className="space-y-4">
              {reflection.questions.map((question, index) => (
                <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    {index + 1}. {question.question}
                  </h4>
                  <div className="text-gray-900">
                    {question.type === 'rating' ? (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <span
                            key={rating}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                              question.answer === rating.toString()
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-gray-300 text-gray-400'
                            }`}
                          >
                            {rating}
                          </span>
                        ))}
                        <span className="ml-2 text-gray-600">({question.answer}/5)</span>
                      </div>
                    ) : question.type === 'boolean' ? (
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        question.answer === 'yes' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {question.answer === 'yes' ? 'Yes' : 'No'}
                      </span>
                    ) : (
                      <p className="whitespace-pre-wrap">{question.answer || 'No answer provided'}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          {reflection.notes && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Additional Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{reflection.notes}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t bg-white">
          <button 
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoReflectionLog;