import api from './api'

// Mock data
const mockSquads = [
  {
    id: '1',
    name: 'Eagle Squad',
    category: 'Senior',
    scout_group: 'Group A',
    members: [
      { id: '1', name: 'John Doe', age: 16 },
      { id: '2', name: 'Jane Smith', age: 15 },
      { id: '3', name: 'Mike Johnson', age: 16 }
    ],
    estimated_arrival_time: '2024-01-15T08:00:00Z',
    status: 'active',
    created_at: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Wolf Pack',
    category: 'Junior',
    scout_group: 'Group B',
    members: [
      { id: '4', name: 'Sarah Wilson', age: 14 },
      { id: '5', name: 'Tom Brown', age: 13 },
      { id: '6', name: 'Lisa Davis', age: 14 }
    ],
    estimated_arrival_time: '2024-01-15T08:15:00Z',
    status: 'active',
    created_at: '2024-01-01T11:00:00Z'
  },
  {
    id: '3',
    name: 'Bear Clan',
    category: 'Senior',
    scout_group: 'Group C',
    members: [
      { id: '7', name: 'Alex Turner', age: 16 },
      { id: '8', name: 'Emma White', age: 15 },
      { id: '9', name: 'Chris Lee', age: 16 },
      { id: '10', name: 'Sophie Green', age: 15 }
    ],
    estimated_arrival_time: '2024-01-15T08:30:00Z',
    status: 'active',
    created_at: '2024-01-01T12:00:00Z'
  }
]

export const squadService = {
  async getSquads() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockSquads
  },
  
  async getSquad(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const squad = mockSquads.find(s => s.id === id)
    if (!squad) {
      throw new Error('Squad not found')
    }
    return squad
  },
  
  async createSquad(squadData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newSquad = {
      id: Date.now().toString(),
      ...squadData,
      status: 'draft',
      created_at: new Date().toISOString()
    }
    
    mockSquads.push(newSquad)
    return newSquad
  },
  
  async updateSquad(id, data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const index = mockSquads.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Squad not found')
    }
    
    mockSquads[index] = { ...mockSquads[index], ...data }
    return mockSquads[index]
  },
  
  async deleteSquad(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockSquads.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Squad not found')
    }
    
    mockSquads.splice(index, 1)
    return { success: true }
  }
} 