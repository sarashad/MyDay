// ── AUTH ─────────────────────────────────────────────────
export interface AuthResponse {
  token: string
  firstName: string
  email: string
  expiresAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  email: string
  password: string
}

// ── TODO ─────────────────────────────────────────────────
export interface Todo {
  id: number
  title: string
  description?: string
  isCompleted: boolean
  priority: Priority
  dueDate?: string
  createdAt: string
}

export const Priority = {
  Low: 0,
  Medium: 1,
  High: 2
} as const

export type Priority = typeof Priority[keyof typeof Priority]

export interface CreateTodoRequest {
  title: string
  description?: string
  priority: Priority
  dueDate?: string
}

export interface UpdateTodoRequest {
  title: string
  description?: string
  priority: Priority
  dueDate?: string
}

// ── HABIT ─────────────────────────────────────────────────
export interface Habit {
  id: number
  name: string
  icon?: string
  createdAt: string
  currentStreak: number
  completedToday: boolean
}

export interface CreateHabitRequest {
  name: string
  icon?: string
}

// ── GOAL ──────────────────────────────────────────────────
export interface Goal {
  id: number
  title: string
  description?: string
  deadline?: string
  isCompleted: boolean
  createdAt: string
  steps: GoalStep[]
  totalSteps: number
  completedSteps: number
  progressPercent: number
}

export interface GoalStep {
  id: number
  title: string
  isCompleted: boolean
}

export interface CreateGoalRequest {
  title: string
  description?: string
  deadline?: string
  steps: string[]
}