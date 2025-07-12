import api from './api'

// Mock data
const mockLeaderboard = [
  {
    squad_id: '1',
    squad_name: 'Eagle Squad',
    scout_group_name: 'Group A',
    event_id: '1',
    event_name: 'Spring Orienteering Challenge 2024',
    checkpoints_completed: 5,
    total_checkpoints: 5,
    sub_challenge_score: 85,
    start_time: '2024-01-15T08:00:00Z',
    end_time: '2024-01-15T12:30:00Z',
    total_time_minutes: 270,
    composite_score: 92.5
  },
  {
    squad_id: '2',
    squad_name: 'Wolf Pack',
    scout_group_name: 'Group B',
    event_id: '1',
    event_name: 'Spring Orienteering Challenge 2024',
    checkpoints_completed: 4,
    total_checkpoints: 5,
    sub_challenge_score: 78,
    start_time: '2024-01-15T08:15:00Z',
    end_time: '2024-01-15T13:00:00Z',
    total_time_minutes: 285,
    composite_score: 84.2
  },
  {
    squad_id: '3',
    squad_name: 'Bear Clan',
    scout_group_name: 'Group C',
    event_id: '1',
    event_name: 'Spring Orienteering Challenge 2024',
    checkpoints_completed: 5,
    total_checkpoints: 5,
    sub_challenge_score: 92,
    start_time: '2024-01-15T08:30:00Z',
    end_time: '2024-01-15T11:45:00Z',
    total_time_minutes: 195,
    composite_score: 95.8
  }
]

export const leaderboardService = {
  async getLeaderboard(eventId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockLeaderboard.filter(entry => entry.event_id === eventId)
  },
  
  async getLiveLeaderboard(eventId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockLeaderboard.filter(entry => entry.event_id === eventId)
  },
  
  async getSquadRank(squadId, eventId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    const leaderboard = mockLeaderboard.filter(entry => entry.event_id === eventId)
    const squad = leaderboard.find(entry => entry.squad_id === squadId)
    if (!squad) return null
    
    const rank = leaderboard.findIndex(entry => entry.squad_id === squadId) + 1
    return { ...squad, rank }
  }
} 