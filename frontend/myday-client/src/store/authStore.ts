import { create } from 'zustand'
import type { AuthResponse } from '../types'

// This is our global state for authentication
// Think of it like a "global variable" that all components can read and update

interface AuthState {
  token: string | null        // JWT token
  firstName: string | null    // User's first name
  email: string | null        // User's email
  isAuthenticated: boolean    // Is user logged in?

  // Actions
  login: (data: AuthResponse) => void   // Save login data
  logout: () => void                     // Clear login data
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state — read from localStorage so user stays logged in after refresh
  token: localStorage.getItem('token'),
  firstName: localStorage.getItem('firstName'),
  email: localStorage.getItem('email'),
  isAuthenticated: !!localStorage.getItem('token'),

  // Login action — saves data to state AND localStorage
  login: (data: AuthResponse) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('firstName', data.firstName)
    localStorage.setItem('email', data.email)
    set({
      token: data.token,
      firstName: data.firstName,
      email: data.email,
      isAuthenticated: true,
    })
  },

  // Logout action — clears everything
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('firstName')
    localStorage.removeItem('email')
    set({
      token: null,
      firstName: null,
      email: null,
      isAuthenticated: false,
    })
  },
}))