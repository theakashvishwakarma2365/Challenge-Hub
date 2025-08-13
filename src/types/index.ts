export interface Task {
  id: string;
  name: string;
  category: 'health' | 'work' | 'learning' | 'reflection' | 'custom';
  completed: boolean;
  time: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number; // in minutes
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  currentDay: number;
  totalDays: number;
  status: 'active' | 'completed' | 'paused' | 'draft';
  rules: string[];
  tasks: Task[];
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoReflection {
  id: string;
  challengeId: string;
  day: number;
  date: string;
  duration: number;
  questions: ReflectionQuestion[];
  notes?: string;
  mood: 1 | 2 | 3 | 4 | 5;
}

export interface ReflectionQuestion {
  id: string;
  question: string;
  answer: string;
  type: 'text' | 'boolean' | 'rating';
}

export interface DailyProgress {
  id: string;
  challengeId: string;
  date: string;
  day: number; // Which day of the challenge this represents
  completedTasks: string[];
  totalTasks: number;
  completionPercentage: number;
  notes?: string;
  mood: 1 | 2 | 3 | 4 | 5;
}

export interface CommitmentLetter {
  id: string;
  challengeId: string;
  content: string;
  signedDate: string;
  witnessName?: string;
  witnessEmail?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  reminderTimes: string[];
  timezone: string;
  language: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  signature?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}