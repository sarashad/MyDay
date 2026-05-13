import api from './axios'
import type { Goal, CreateGoalRequest } from '../types'

export const goalsApi = {
  getAll: async (): Promise<Goal[]> => {
    const response = await api.get<Goal[]>('/goal')
    return response.data
  },

  create: async (data: CreateGoalRequest): Promise<Goal> => {
    const response = await api.post<Goal>('/goal', data)
    return response.data
  },

  completeStep: async (goalId: number, stepId: number): Promise<Goal> => {
    const response = await api.patch<Goal>(`/goal/${goalId}/steps/${stepId}`)
    return response.data
  },

  update: async (id: number, data: any): Promise<Goal> => {
  const response = await api.put<Goal>(`/goal/${id}`, data)
  return response.data
},

  delete: async (id: number): Promise<void> => {
    await api.delete(`/goal/${id}`)
  },
}