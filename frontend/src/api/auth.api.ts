import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const login = (email: string, password: string) => 
  api.post('/auth/login', { email, password })

export const register = (email: string, password: string) =>
  api.post('/auth/register', { email, password });

export const checkAuth = () => 
  api.get('/auth/check')