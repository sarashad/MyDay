import api from './axios'
import type { Habit, CreateHabitRequest } from '../types'

export const habitsApi = {
  getAll: async (): Promise<Habit[]> => {
    const response = await api.get<Habit[]>('/habit')
    return response.data
  },

  create: async (data: CreateHabitRequest): Promise<Habit> => {
    const response = await api.post<Habit>('/habit', data)
    return response.data
  },

  logToday: async (id: number, note?: string): Promise<Habit> => {
    const response = await api.post<Habit>(`/habit/${id}/log`, { note })
    return response.data
  },

  undoToday: async (id: number): Promise<Habit> => {
    const response = await api.post<Habit>(`/habit/${id}/undo`)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/habit/${id}`)
  },
}