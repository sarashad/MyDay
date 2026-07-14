export interface SparkResponse {
  id: number;
  taskText: string;
  motivationalMessage: string;
  date: string;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface BadgeResponse {
  key: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface StreakResponse {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  lastCompletedDate: string | null;
  badges: BadgeResponse[];
}

export interface HeatmapEntry {
  date: string;
  completed: boolean;
}