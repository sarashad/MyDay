import api from './axios'
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types'

export const todosApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await api.get<Todo[]>('/todo')
    return response.data
  },

  create: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post<Todo>('/todo', data)
    return response.data
  },

  update: async (id: number, data: UpdateTodoRequest): Promise<Todo> => {
    const response = await api.put<Todo>(`/todo/${id}`, data)
    return response.data
  },

  complete: async (id: number): Promise<Todo> => {
    const response = await api.patch<Todo>(`/todo/${id}/complete`)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/todo/${id}`)
  },
}