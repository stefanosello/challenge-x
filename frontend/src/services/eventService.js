import api from './api'

// Mock data
const mockEvents = [
  {
    id: '1',
    name: 'Spring Orienteering Challenge 2024',
    description: 'Annual spring orienteering challenge with sub-challenges',
    start_time: '2024-01-15T08:00:00Z',
    end_time: '2024-01-15T16:00:00Z',
    status: 'active',
    max_squads: 20,
    registration_deadline: '2024-01-10T23:59:59Z',
    created_at: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Summer Adventure Challenge 2024',
    description: 'Summer adventure challenge with technical sub-challenges',
    start_time: '2024-06-15T09:00:00Z',
    end_time: '2024-06-15T17:00:00Z',
    status: 'draft',
    max_squads: 25,
    registration_deadline: '2024-06-10T23:59:59Z',
    created_at: '2024-01-01T11:00:00Z'
  }
]

const mockCheckpoints = [
  {
    id: '1',
    event_id: '1',
    name: 'Starting Point',
    description: 'Event starting point',
    latitude: 45.4642,
    longitude: 9.1900,
    order_number: 1,
    required: true,
    checkpoint_type: 'starting_point',
    created_at: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    event_id: '1',
    name: 'Lake View',
    description: 'Checkpoint near the lake',
    latitude: 45.4650,
    longitude: 9.1910,
    order_number: 2,
    required: true,
    checkpoint_type: 'regular',
    has_sub_challenge: true,
    created_at: '2024-01-01T10:00:00Z'
  },
  {
    id: '3',
    event_id: '1',
    name: 'Forest Trail',
    description: 'Checkpoint in the forest',
    latitude: 45.4660,
    longitude: 9.1920,
    order_number: 3,
    required: true,
    checkpoint_type: 'regular',
    has_sub_challenge: false,
    created_at: '2024-01-01T10:00:00Z'
  },
  {
    id: '4',
    event_id: '1',
    name: 'Mountain Peak',
    description: 'Checkpoint at the mountain peak',
    latitude: 45.4670,
    longitude: 9.1930,
    order_number: 4,
    required: true,
    checkpoint_type: 'regular',
    has_sub_challenge: true,
    created_at: '2024-01-01T10:00:00Z'
  },
  {
    id: '5',
    event_id: '1',
    name: 'Finish Line',
    description: 'Event finish line',
    latitude: 45.4680,
    longitude: 9.1940,
    order_number: 5,
    required: true,
    checkpoint_type: 'finish_line',
    created_at: '2024-01-01T10:00:00Z'
  }
]

export const eventService = {
  async getEvents() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockEvents
  },
  
  async getEvent(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const event = mockEvents.find(e => e.id === id)
    if (!event) {
      throw new Error('Event not found')
    }
    return event
  },
  
  async getCheckpoints(eventId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockCheckpoints.filter(c => c.event_id === eventId)
  },
  
  async createEvent(eventData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      status: 'draft',
      created_at: new Date().toISOString()
    }
    
    mockEvents.push(newEvent)
    return newEvent
  },
  
  async updateEvent(id, data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const index = mockEvents.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error('Event not found')
    }
    
    mockEvents[index] = { ...mockEvents[index], ...data }
    return mockEvents[index]
  }
} 