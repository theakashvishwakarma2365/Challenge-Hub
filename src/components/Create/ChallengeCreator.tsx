import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Target, Clock, FileText, Save, X } from 'lucide-react';
import { Challenge, Task } from '../../types';

interface ChallengeCreatorProps {
  onCreateChallenge: (challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt' | 'currentDay'>) => void;
  onCancel?: () => void;
}

const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({ onCreateChallenge, onCancel }) => {
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

  const handleAddRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const handleUpdateRule = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, task]);
    setShowTaskForm(false);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const endDate = new Date(formData.startDate);
    endDate.setDate(endDate.getDate() + formData.totalDays - 1);

    const challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt' | 'currentDay'> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate,
      endDate: endDate.toISOString().split('T')[0],
      totalDays: formData.totalDays,
      status: formData.status,
      rules: formData.rules.filter(rule => rule.trim()),
      tasks: tasks,
      color: formData.color,
      icon: formData.icon,
    };

    onCreateChallenge(challenge);
  };

  const presetChallenges = [
    {
      name: '21-Day Health & Productivity Challenge',
      description: 'Transform your daily routine with healthy habits and productive work sessions',
      rules: [
        'Follow the routine from Thursday to Monday exactly as planned',
        'On Tuesday and Wednesday (off days), follow rest routine',
        'Complete daily task checklist',
        'Record daily video reflection',
        'Maintain proper sleep schedule',
        'Practice daily learning and health activities'
      ],
      tasks: [
        { name: 'Morning Exercise (30 min)', category: 'health' as const, time: '07:00', priority: 'high' as const, estimatedDuration: 30, completed: false, description: 'Start your day with energizing exercise' },
        { name: 'Healthy Breakfast', category: 'health' as const, time: '08:00', priority: 'high' as const, estimatedDuration: 20, completed: false, description: 'Nutritious meal to fuel your day' },
        { name: 'Deep Work Session 1', category: 'work' as const, time: '09:00', priority: 'high' as const, estimatedDuration: 120, completed: false, description: 'Focused work on important tasks' },
        { name: 'Learn Something New (1 hour)', category: 'learning' as const, time: '14:00', priority: 'medium' as const, estimatedDuration: 60, completed: false, description: 'Dedicate time to learning and growth' },
        { name: 'Deep Work Session 2', category: 'work' as const, time: '15:30', priority: 'high' as const, estimatedDuration: 90, completed: false, description: 'Second focused work session' },
        { name: 'Evening Reflection Video', category: 'reflection' as const, time: '20:00', priority: 'medium' as const, estimatedDuration: 10, completed: false, description: 'Record daily reflection video' },
      ]
    },
    {
      name: '30-Day Fitness Challenge',
      description: 'Build strength, endurance, and healthy habits over 30 days',
      rules: [
        'Complete daily workout routine',
        'Track nutrition and water intake',
        'Get adequate sleep (7-8 hours)',
        'Take progress photos weekly',
        'Record daily energy levels and mood'
      ],
      tasks: [
        { name: 'Morning Workout', category: 'health' as const, time: '06:30', priority: 'high' as const, estimatedDuration: 45, completed: false, description: 'Daily fitness routine' },
        { name: 'Meal Prep', category: 'health' as const, time: '18:00', priority: 'medium' as const, estimatedDuration: 30, completed: false, description: 'Prepare healthy meals' },
        { name: 'Water Intake Check', category: 'health' as const, time: '12:00', priority: 'low' as const, estimatedDuration: 5, completed: false, description: 'Ensure proper hydration' },
        { name: 'Evening Stretch', category: 'health' as const, time: '21:00', priority: 'medium' as const, estimatedDuration: 15, completed: false, description: 'Relaxing stretches before bed' },
      ]
    }
  ];

  const loadPreset = (preset: typeof presetChallenges[0]) => {
    setFormData(prev => ({
      ...prev,
      name: preset.name,
      description: preset.description,
      rules: preset.rules,
    }));
    setTasks(preset.tasks);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Create New Challenge</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        )}
      </div>

      {/* Preset Challenges */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Start Templates</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {presetChallenges.map((preset, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <h4 className="font-semibold text-gray-900 mb-2">{preset.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{preset.tasks.length} tasks • {preset.rules.length} rules</span>
                <button
                  onClick={() => loadPreset(preset)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Basic Information
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Challenge Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter challenge name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe your challenge goals and motivation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                value={formData.totalDays}
                onChange={(e) => setFormData({ ...formData, totalDays: parseInt(e.target.value) || 21 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="365"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Challenge['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color Theme
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Challenge Rules
          </h3>
          
          <div className="space-y-3">
            {formData.rules.map((rule, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => handleUpdateRule(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Rule ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRule(index)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddRule}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Rule
            </button>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Daily Tasks ({tasks.length})
            </h3>
            <button
              type="button"
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tasks added yet</p>
              <p className="text-sm">Add some tasks to structure your daily routine</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((task, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{task.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-600' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {task.time} • {task.estimatedDuration}min • {task.category}
                      </div>
                      {task.description && (
                        <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <Save className="w-5 h-5" />
            Create Challenge
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskFormModal
          onSave={handleAddTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
};

// Task Form Modal Component
interface TaskFormModalProps {
  onSave: (task: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ onSave, onCancel }) => {
  const [taskData, setTaskData] = useState({
    name: '',
    category: 'custom' as Task['category'],
    time: '09:00',
    description: '',
    priority: 'medium' as Task['priority'],
    estimatedDuration: 30,
    completed: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskData.name.trim()) return;
    
    onSave(taskData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Name *
              </label>
              <input
                type="text"
                value={taskData.name}
                onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={taskData.category}
                  onChange={(e) => setTaskData({ ...taskData, category: e.target.value as Task['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="health">Health</option>
                  <option value="work">Work</option>
                  <option value="learning">Learning</option>
                  <option value="reflection">Reflection</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={taskData.time}
                  onChange={(e) => setTaskData({ ...taskData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as Task['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (min)
                </label>
                <input
                  type="number"
                  value={taskData.estimatedDuration}
                  onChange={(e) => setTaskData({ ...taskData, estimatedDuration: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="5"
                  max="480"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Add any additional details..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCreator;