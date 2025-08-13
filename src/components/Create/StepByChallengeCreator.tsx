import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Target, FileText, Save, X, ArrowRight, ArrowLeft, CheckCircle, Zap } from 'lucide-react';
import { Challenge, Task, UserProfile } from '../../types';
import CommitmentModal from '../Challenges/CommitmentModal';

interface StepByChallengeCreatorProps {
  onCreateChallenge: (challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt' | 'currentDay'>) => void;
  onCancel?: () => void;
  userProfile: UserProfile;
}

const StepByChallengeCreator: React.FC<StepByChallengeCreatorProps> = ({ 
  onCreateChallenge, 
  onCancel, 
  userProfile 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  const [pendingChallenge, setPendingChallenge] = useState<Omit<Challenge, 'id' | 'createdAt' | 'updatedAt' | 'currentDay'> | null>(null);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    totalDays: 21,
    status: 'draft' as Challenge['status'],
    rules: [''],
    color: '#3B82F6',
    icon: 'target',
  });

  const [tasks, setTasks] = useState<Omit<Task, 'id'>[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const steps = [
    { number: 1, title: 'Basic Info', icon: Target, description: 'Name and describe your challenge' },
    { number: 2, title: 'Duration & Style', icon: Calendar, description: 'Set timeline and appearance' },
    { number: 3, title: 'Tasks & Rules', icon: CheckCircle, description: 'Add tasks and guidelines' },
    { number: 4, title: 'Review & Create', icon: Zap, description: 'Final review and launch' }
  ];

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
  ];

  const icons = [
    'target', 'trophy', 'heart', 'brain', 'muscle', 'book',
    'star', 'flame', 'lightning', 'diamond', 'sun', 'moon'
  ];

  const handleAddRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleRuleChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const handleAddTask = () => {
    setShowTaskForm(true);
  };

  const handleSaveTask = (taskData: { 
    name: string; 
    category: 'health' | 'work' | 'learning' | 'reflection' | 'custom';
    time: string;
    priority: 'low' | 'medium' | 'high';
    estimatedDuration: number;
    description?: string;
  }) => {
    const newTask: Omit<Task, 'id'> = {
      name: taskData.name,
      category: taskData.category,
      time: taskData.time,
      priority: taskData.priority,
      estimatedDuration: taskData.estimatedDuration,
      completed: false,
      description: taskData.description
    };
    setTasks(prev => [...prev, newTask]);
    setShowTaskForm(false);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateChallenge = () => {
    // Convert tasks to include temporary IDs for the challenge creation
    const tasksWithIds: Task[] = tasks.map((task, index) => ({
      ...task,
      id: `temp-${index}`
    }));

    const challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt' | 'currentDay'> = {
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: new Date(new Date(formData.startDate).getTime() + (formData.totalDays - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalDays: formData.totalDays,
      status: formData.status,
      rules: formData.rules.filter(rule => rule.trim() !== ''),
      color: formData.color,
      icon: formData.icon,
      tasks: tasksWithIds
    };

    // Store the challenge temporarily and show commitment modal
    setPendingChallenge(challenge);
    setShowCommitmentModal(true);
  };

  const handleCommitmentComplete = () => {
    if (pendingChallenge) {
      onCreateChallenge(pendingChallenge);
      setShowCommitmentModal(false);
      setPendingChallenge(null);
    }
  };

  const handleCommitmentCancel = () => {
    setShowCommitmentModal(false);
    setPendingChallenge(null);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '' && formData.description.trim() !== '';
      case 2:
        return formData.totalDays > 0 && formData.startDate !== '';
      case 3:
        return true; // Tasks and rules are optional
      case 4:
        return true; // Review step is always valid
      default:
        return false;
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      target: Target,
      trophy: Target,
      heart: Target,
      brain: Target,
      muscle: Target,
      book: FileText,
      star: Target,
      flame: Target,
      lightning: Zap,
      diamond: Target,
      sun: Target,
      moon: Target,
    };
    const IconComponent = iconMap[iconName] || Target;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Challenge</h1>
            <p className="text-gray-600">Build a challenge that will transform your habits</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white'
                        : isActive
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 ml-4 ${
                        currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep - 1].title}</h2>
              <p className="text-gray-600">{steps[currentStep - 1].description}</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenge Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 30-Day Fitness Challenge"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what this challenge is about and what you hope to achieve..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Duration & Style */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Days) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={formData.totalDays}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalDays: parseInt(e.target.value) || 1 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Color Theme
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-12 h-12 rounded-lg border-2 transition-transform ${
                          formData.color === color 
                            ? 'border-gray-400 scale-110' 
                            : 'border-gray-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Icon
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-colors ${
                          formData.icon === icon 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {getIconComponent(icon)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Tasks & Rules */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Tasks Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Daily Tasks (Optional)</h3>
                    <button
                      onClick={handleAddTask}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </button>
                  </div>

                  {tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No tasks added yet. Tasks help you track specific actions within your challenge.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{task.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">{task.category} • {task.time} • {task.estimatedDuration}min</p>
                          </div>
                          <button
                            onClick={() => handleRemoveTask(index)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rules Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Challenge Rules (Optional)</h3>
                    <button
                      onClick={handleAddRule}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rule
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.rules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={rule}
                          onChange={(e) => handleRuleChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Exercise for at least 30 minutes"
                        />
                        {formData.rules.length > 1 && (
                          <button
                            onClick={() => handleRemoveRule(index)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Create */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div 
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white"
                    style={{ backgroundColor: formData.color }}
                  >
                    {getIconComponent(formData.icon)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.name}</h3>
                  <p className="text-gray-600 mb-4">{formData.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium text-gray-900">{formData.totalDays} Days</p>
                    <p className="text-sm text-gray-600">Duration</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="font-medium text-gray-900">{tasks.length} Tasks</p>
                    <p className="text-sm text-gray-600">Daily Actions</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="font-medium text-gray-900">{formData.rules.filter(r => r.trim()).length} Rules</p>
                    <p className="text-sm text-gray-600">Guidelines</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Start Date: {new Date(formData.startDate).toLocaleDateString()}</h4>
                  <p className="text-sm text-blue-700">
                    {new Date(formData.startDate) > new Date() 
                      ? "This challenge will start on the selected date and begin in 'draft' status until then."
                      : "This challenge will start immediately and be set to 'active' status."
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pb-24 md:pb-4">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              )}
              
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              )}
            </div>

            <div>
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleCreateChallenge}
                  disabled={!isStepValid()}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Challenge
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskFormModal 
          onSave={handleSaveTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {/* Commitment Modal */}
      {showCommitmentModal && pendingChallenge && (
        <CommitmentModal
          userName={userProfile.name}
          challengeName={pendingChallenge.name}
          isOpen={showCommitmentModal}
          onCommit={handleCommitmentComplete}
          onCancel={handleCommitmentCancel}
        />
      )}
    </>
  );
};

// Task Form Modal Component
interface TaskFormModalProps {
  onSave: (task: { 
    name: string; 
    category: 'health' | 'work' | 'learning' | 'reflection' | 'custom';
    time: string;
    priority: 'low' | 'medium' | 'high';
    estimatedDuration: number;
    description?: string;
  }) => void;
  onCancel: () => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ onSave, onCancel }) => {
  const [taskData, setTaskData] = useState({
    name: '',
    category: 'health' as 'health' | 'work' | 'learning' | 'reflection' | 'custom',
    time: '09:00',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedDuration: 30,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskData.name.trim()) {
      onSave(taskData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name
            </label>
            <input
              type="text"
              value={taskData.name}
              onChange={(e) => setTaskData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Morning Exercise"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={taskData.category}
                onChange={(e) => setTaskData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="health">Health</option>
                <option value="work">Work</option>
                <option value="learning">Learning</option>
                <option value="reflection">Reflection</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={taskData.time}
                onChange={(e) => setTaskData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={taskData.estimatedDuration}
                onChange={(e) => setTaskData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 30 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the task..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!taskData.name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepByChallengeCreator;
