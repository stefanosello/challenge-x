import api from './api'

// Mock data
const mockUsers = [
  {
    id: '1',
    email: 'admin@scout.com',
    name: 'Admin User',
    role: 'admin',
    scout_group: 'Group A'
  },
  {
    id: '2',
    email: 'leader@scout.com',
    name: 'Squad Leader',
    role: 'squad_leader',
    scout_group: 'Group B'
  },
  {
    id: '3',
    email: 'subchallenge@scout.com',
    name: 'Sub Challenge Leader',
    role: 'sub_challenge_leader',
    scout_group: 'Group C'
  }
]

const mockTokens = {
  'admin@scout.com': 'mock-admin-token',
  'leader@scout.com': 'mock-leader-token',
  'subchallenge@scout.com': 'mock-subchallenge-token'
}

export const authService = {
  async login(credentials) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = mockUsers.find(u => u.email === credentials.email)
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    const token = mockTokens[credentials.email]
    return {
      user,
      token
    }
  },
  
  async register(userData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'scout'
    }
    
    mockUsers.push(newUser)
    mockTokens[userData.email] = `mock-token-${Date.now()}`
    
    return {
      user: newUser,
      token: mockTokens[userData.email]
    }
  },
  
  async getCurrentUser() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found')
    }
    
    // Find user by token (in real app, this would be decoded from JWT)
    const user = mockUsers.find(u => mockTokens[u.email] === token)
    if (!user) {
      throw new Error('Invalid token')
    }
    
    return user
  },
  
  async logout() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    localStorage.removeItem('token')
  }
} 