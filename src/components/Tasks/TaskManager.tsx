import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, Flag, CheckCircle, Heart, Zap, Book, Video } from 'lucide-react';
import { Challenge, Task, DailyProgress } from '../../types';

interface TaskManagerProps {
  activeChallenge: Challenge | null;
  todayProgress: DailyProgress | null;
  onUpdateTask: (challengeId: string, taskId: string, updates: Partial<Task>) => void;
  onAddTask: (challengeId: string, task: Omit<Task, 'id'>) => void;
  onDeleteTask: (challengeId: string, taskId: string) => void;
  onRecordProgress: (challengeId: string, completedTaskIds: string[], notes?: string, mood?: 1 | 2 | 3 | 4 | 5) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  activeChallenge,
  todayProgress,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
  onRecordProgress,
}) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(
    new Set(todayProgress?.completedTasks || [])
  );

  // Update completedTasks when todayProgress changes
  useEffect(() => {
    setCompletedTasks(new Set(todayProgress?.completedTasks || []));
  }, [todayProgress]);

  const getCategoryIcon = (category: string) => {
    const icons = {
      health: <Heart className="w-4 h-4" />,
      work: <Zap className="w-4 h-4" />,
      learning: <Book className="w-4 h-4" />,
      reflection: <Video className="w-4 h-4" />,
      custom: <Flag className="w-4 h-4" />
    };
    return icons[category as keyof typeof icons] || <Flag className="w-4 h-4" />;
  };

  const toggleTask = (taskId: string) => {
    const newCompletedTasks = new Set(completedTasks);
    if (newCompletedTasks.has(taskId)) {
      newCompletedTasks.delete(taskId);
    } else {
      newCompletedTasks.add(taskId);
    }
    setCompletedTasks(newCompletedTasks);
    
    if (activeChallenge) {
      onRecordProgress(activeChallenge.id, Array.from(newCompletedTasks));
    }
  };

  const getCompletionPercentage = () => {
    if (!activeChallenge?.tasks.length) return 0;
    return Math.round((completedTasks.size / activeChallenge.tasks.length) * 100);
  };

  if (!activeChallenge) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">No Active Challenge</h2>
        <p className="text-gray-500">Select or create a challenge to manage tasks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Daily Tasks</h2>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold text-blue-600">
            {getCompletionPercentage()}% Complete
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Today's Progress</span>
          <span className="text-sm text-gray-500">
            {completedTasks.size}/{activeChallenge.tasks.length} tasks
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 rounded-full h-2 transition-all duration-300"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
      </div>

      {/* Tasks by Category */}
      <div className="grid gap-4">
        {['health', 'work', 'learning', 'reflection', 'custom'].map(category => {
          const categoryTasks = activeChallenge.tasks.filter(task => task.category === category);
          if (categoryTasks.length === 0) return null;
          
          const completed = categoryTasks.filter(task => completedTasks.has(task.id)).length;
          
          return (
            <div key={category} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category}
                </h3>
                <span className="text-sm text-gray-600">
                  {completed}/{categoryTasks.length} completed
                </span>
              </div>
              
              <div className="space-y-3">
                {categoryTasks
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(task.id);
                        }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          completedTasks.has(task.id)
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {completedTasks.has(task.id) && <CheckCircle className="w-4 h-4" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${completedTasks.has(task.id) ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.name}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flag className={`w-3 h-3 ${
                              task.priority === 'high' ? 'text-red-500' :
                              task.priority === 'medium' ? 'text-yellow-500' :
                              'text-gray-400'
                            }`} />
                            {task.priority}
                          </span>
                          <span>{task.estimatedDuration}min</span>
                        </div>
                        {task.description && (
                          <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                        )}
                      </div>
                      
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTask(task);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete "${task.name}"?`)) {
                              onDeleteTask(activeChallenge.id, task.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Task Modal */}
      {(showAddTask || editingTask) && (
        <TaskModal
          task={editingTask}
          onSave={(taskData) => {
            if (editingTask) {
              onUpdateTask(activeChallenge.id, editingTask.id, taskData);
              setEditingTask(null);
            } else {
              onAddTask(activeChallenge.id, taskData);
              setShowAddTask(false);
            }
          }}
          onCancel={() => {
            setShowAddTask(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

// Task Modal Component
interface TaskModalProps {
  task: Task | null;
  onSave: (task: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    category: task?.category || 'custom' as Task['category'],
    time: task?.time || '09:00',
    description: task?.description || '',
    priority: task?.priority || 'medium' as Task['priority'],
    estimatedDuration: task?.estimatedDuration || 30,
    completed: task?.completed || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b bg-white">
          <h2 className="text-xl font-bold">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 modal-scroll">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Task['category'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="health">Health</option>
                <option value="work">Work</option>
                <option value="learning">Learning</option>
                <option value="reflection">Reflection</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="5"
                max="480"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Add any additional details..."
              />
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t bg-white">
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {task ? 'Update Task' : 'Add Task'}
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

export default TaskManager;