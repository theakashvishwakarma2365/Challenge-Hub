import { Challenge } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split('T')[0];

// Get future date
const getFutureDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const quickStartChallenges: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt' | 'currentDay'>[] = [
  {
    name: "21-Day Healthy Habits",
    description: "Build fundamental healthy habits that will transform your daily routine. Perfect for beginners looking to create a solid foundation for wellness.",
    startDate: getTodayDate(),
    endDate: getFutureDate(20),
    totalDays: 21,
    status: 'draft',
    rules: [
      "Complete at least 4 out of 6 tasks daily",
      "Track your mood and energy levels",
      "Take progress photos weekly",
      "No more than 1 skip day per week"
    ],
    color: "#10B981", // Green
    icon: "💚",
    tasks: [
      {
        id: uuidv4(),
        name: "Morning Exercise (30 min)",
        category: "health",
        completed: false,
        time: "07:00",
        description: "Start your day with energizing exercise - walking, yoga, or any physical activity",
        priority: "high",
        estimatedDuration: 30
      },
      {
        id: uuidv4(),
        name: "Healthy Breakfast",
        category: "health",
        completed: false,
        time: "08:00",
        description: "Nutritious meal to fuel your day",
        priority: "high",
        estimatedDuration: 20
      },
      {
        id: uuidv4(),
        name: "Drink 2L Water",
        category: "health",
        completed: false,
        time: "09:00",
        description: "Stay hydrated throughout the day",
        priority: "medium",
        estimatedDuration: 5
      },
      {
        id: uuidv4(),
        name: "10-Minute Learning",
        category: "learning",
        completed: false,
        time: "19:00",
        description: "Read, watch educational content, or practice a skill",
        priority: "medium",
        estimatedDuration: 10
      },
      {
        id: uuidv4(),
        name: "Evening Gratitude",
        category: "reflection",
        completed: false,
        time: "21:00",
        description: "Write down 3 things you're grateful for today",
        priority: "medium",
        estimatedDuration: 5
      },
      {
        id: uuidv4(),
        name: "7+ Hours Sleep",
        category: "health",
        completed: false,
        time: "22:30",
        description: "Get quality rest for recovery and mental health",
        priority: "high",
        estimatedDuration: 420
      }
    ]
  },

  {
    name: "30-Day Productivity Master",
    description: "Transform your productivity with proven time management and focus techniques. Ideal for professionals and students.",
    startDate: getTodayDate(),
    endDate: getFutureDate(29),
    totalDays: 30,
    status: 'draft',
    rules: [
      "Complete all 5 core tasks daily",
      "Track time spent on each task",
      "Weekly productivity review",
      "Eliminate distractions during focus blocks"
    ],
    color: "#3B82F6", // Blue
    icon: "⚡",
    tasks: [
      {
        id: uuidv4(),
        name: "Morning Planning (15 min)",
        category: "work",
        completed: false,
        time: "08:00",
        description: "Plan your day, set priorities, and time-block important tasks",
        priority: "high",
        estimatedDuration: 15
      },
      {
        id: uuidv4(),
        name: "Deep Work Session 1",
        category: "work",
        completed: false,
        time: "09:00",
        description: "90-minute focused work on your most important task",
        priority: "high",
        estimatedDuration: 90
      },
      {
        id: uuidv4(),
        name: "Email & Communication",
        category: "work",
        completed: false,
        time: "11:00",
        description: "Process emails and handle communication efficiently",
        priority: "medium",
        estimatedDuration: 30
      },
      {
        id: uuidv4(),
        name: "Deep Work Session 2",
        category: "work",
        completed: false,
        time: "14:00",
        description: "Second focused work session on priority tasks",
        priority: "high",
        estimatedDuration: 90
      },
      {
        id: uuidv4(),
        name: "Daily Review & Tomorrow's Planning",
        category: "reflection",
        completed: false,
        time: "17:00",
        description: "Review today's progress and plan tomorrow's priorities",
        priority: "medium",
        estimatedDuration: 15
      }
    ]
  },

  {
    name: "7-Day Digital Detox",
    description: "Reclaim your time and mental clarity by reducing digital overwhelm. Perfect for anyone feeling overwhelmed by technology.",
    startDate: getTodayDate(),
    endDate: getFutureDate(6),
    totalDays: 7,
    status: 'draft',
    rules: [
      "No social media during designated hours",
      "Phone-free mornings and evenings",
      "Replace screen time with meaningful activities",
      "Daily reflection on digital habits"
    ],
    color: "#8B5CF6", // Purple
    icon: "📱",
    tasks: [
      {
        id: uuidv4(),
        name: "Phone-Free Morning (1 hour)",
        category: "custom",
        completed: false,
        time: "07:00",
        description: "Start your day without immediately checking your phone",
        priority: "high",
        estimatedDuration: 60
      },
      {
        id: uuidv4(),
        name: "Social Media Time Block",
        category: "custom",
        completed: false,
        time: "12:00",
        description: "Limit social media to 30 minutes during lunch",
        priority: "medium",
        estimatedDuration: 30
      },
      {
        id: uuidv4(),
        name: "Real-World Activity",
        category: "custom",
        completed: false,
        time: "15:00",
        description: "Engage in physical activity, reading, or face-to-face conversation",
        priority: "medium",
        estimatedDuration: 45
      },
      {
        id: uuidv4(),
        name: "Evening Device Shutdown",
        category: "custom",
        completed: false,
        time: "20:00",
        description: "Turn off all devices 2 hours before bedtime",
        priority: "high",
        estimatedDuration: 120
      },
      {
        id: uuidv4(),
        name: "Digital Habits Reflection",
        category: "reflection",
        completed: false,
        time: "21:00",
        description: "Journal about your relationship with technology today",
        priority: "medium",
        estimatedDuration: 10
      }
    ]
  },

  {
    name: "14-Day Self-Care Reset",
    description: "Prioritize your mental and emotional well-being with daily self-care practices. Great for stress relief and personal growth.",
    startDate: getTodayDate(),
    endDate: getFutureDate(13),
    totalDays: 14,
    status: 'draft',
    rules: [
      "Practice at least one self-care activity daily",
      "Listen to your body and emotions",
      "No guilt about taking time for yourself",
      "Document how each practice makes you feel"
    ],
    color: "#EC4899", // Pink
    icon: "🌸",
    tasks: [
      {
        id: uuidv4(),
        name: "Morning Mindfulness",
        category: "reflection",
        completed: false,
        time: "08:00",
        description: "5-10 minutes of meditation, deep breathing, or mindful observation",
        priority: "high",
        estimatedDuration: 10
      },
      {
        id: uuidv4(),
        name: "Nourishing Meal",
        category: "health",
        completed: false,
        time: "12:00",
        description: "Eat a meal mindfully, focusing on flavors and nutrition",
        priority: "medium",
        estimatedDuration: 30
      },
      {
        id: uuidv4(),
        name: "Movement for Joy",
        category: "health",
        completed: false,
        time: "16:00",
        description: "Move your body in a way that brings joy - dance, walk, stretch",
        priority: "medium",
        estimatedDuration: 20
      },
      {
        id: uuidv4(),
        name: "Creative Expression",
        category: "custom",
        completed: false,
        time: "19:00",
        description: "Engage in any creative activity - draw, write, sing, craft",
        priority: "medium",
        estimatedDuration: 30
      },
      {
        id: uuidv4(),
        name: "Evening Wind-Down",
        category: "reflection",
        completed: false,
        time: "21:30",
        description: "Relaxing activity before bed - bath, tea, gentle music, or reading",
        priority: "high",
        estimatedDuration: 30
      }
    ]
  },

  {
    name: "10-Day Morning Routine Builder",
    description: "Create a powerful morning routine that sets you up for daily success. Perfect for establishing consistent morning habits.",
    startDate: getTodayDate(),
    endDate: getFutureDate(9),
    totalDays: 10,
    status: 'draft',
    rules: [
      "Wake up at the same time every day",
      "Complete the morning routine before checking phone",
      "Allow flexibility to adjust the routine",
      "Track energy levels throughout the day"
    ],
    color: "#F59E0B", // Orange
    icon: "🌅",
    tasks: [
      {
        id: uuidv4(),
        name: "Wake Up Consistently",
        category: "custom",
        completed: false,
        time: "06:30",
        description: "Wake up at the same time every day to establish rhythm",
        priority: "high",
        estimatedDuration: 5
      },
      {
        id: uuidv4(),
        name: "Hydrate First",
        category: "health",
        completed: false,
        time: "06:35",
        description: "Drink a large glass of water upon waking",
        priority: "high",
        estimatedDuration: 2
      },
      {
        id: uuidv4(),
        name: "Morning Movement",
        category: "health",
        completed: false,
        time: "06:40",
        description: "5-10 minutes of stretching, yoga, or light exercise",
        priority: "medium",
        estimatedDuration: 10
      },
      {
        id: uuidv4(),
        name: "Mindful Minutes",
        category: "reflection",
        completed: false,
        time: "06:50",
        description: "Brief meditation, breathing exercise, or intention setting",
        priority: "medium",
        estimatedDuration: 5
      },
      {
        id: uuidv4(),
        name: "Fuel Your Body",
        category: "health",
        completed: false,
        time: "07:00",
        description: "Eat a nutritious breakfast mindfully",
        priority: "medium",
        estimatedDuration: 20
      },
      {
        id: uuidv4(),
        name: "Plan Your Day",
        category: "work",
        completed: false,
        time: "07:20",
        description: "Review goals and set intentions for the day",
        priority: "high",
        estimatedDuration: 10
      }
    ]
  },

  {
    name: "30-Day Skill Builder",
    description: "Dedicate focused time daily to learning a new skill or improving an existing one. Customizable for any skill you want to develop.",
    startDate: getTodayDate(),
    endDate: getFutureDate(29),
    totalDays: 30,
    status: 'draft',
    rules: [
      "Practice your chosen skill for at least 30 minutes daily",
      "Track progress and breakthroughs",
      "Apply what you learn practically",
      "Weekly skill assessment and adjustment"
    ],
    color: "#6366F1", // Indigo
    icon: "🎯",
    tasks: [
      {
        id: uuidv4(),
        name: "Skill Practice Session",
        category: "learning",
        completed: false,
        time: "18:00",
        description: "Focused practice of your chosen skill for 30-60 minutes",
        priority: "high",
        estimatedDuration: 45
      },
      {
        id: uuidv4(),
        name: "Learn Something New",
        category: "learning",
        completed: false,
        time: "19:00",
        description: "Study new concepts, watch tutorials, or read about your skill",
        priority: "high",
        estimatedDuration: 30
      },
      {
        id: uuidv4(),
        name: "Apply & Experiment",
        category: "learning",
        completed: false,
        time: "19:30",
        description: "Try applying new techniques or concepts you've learned",
        priority: "medium",
        estimatedDuration: 20
      },
      {
        id: uuidv4(),
        name: "Progress Documentation",
        category: "reflection",
        completed: false,
        time: "20:00",
        description: "Document what you learned, challenges faced, and progress made",
        priority: "medium",
        estimatedDuration: 10
      }
    ]
  }
];

export const getChallengeById = (name: string) => {
  return quickStartChallenges.find(challenge => challenge.name === name);
};

export const getAllChallengeNames = () => {
  return quickStartChallenges.map(challenge => challenge.name);
};
