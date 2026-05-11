import axios from 'axios'

// Base URL of our backend API
const api = axios.create({
  baseURL: 'https://localhost:7299/api',
})

// Interceptor = runs before EVERY request automatically
// It adds the JWT token to every request header
api.interceptors.request.use((config) => {
  // Get token from localStorage
  const token = localStorage.getItem('token')

  // If token exists → add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api