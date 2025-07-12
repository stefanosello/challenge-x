import { leaderboardService } from '@/services/leaderboardService'

export default {
  namespaced: true,
  
  state: {
    leaderboard: [],
    loading: false,
    error: null
  },
  
  mutations: {
    SET_LEADERBOARD(state, leaderboard) {
      state.leaderboard = leaderboard
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  
  actions: {
    async fetchLeaderboard({ commit }, eventId) {
      commit('SET_LOADING', true)
      try {
        const leaderboard = await leaderboardService.getLeaderboard(eventId)
        commit('SET_LEADERBOARD', leaderboard)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async refreshLeaderboard({ dispatch }, eventId) {
      await dispatch('fetchLeaderboard', eventId)
    }
  },
  
  getters: {
    leaderboard: state => state.leaderboard,
    loading: state => state.loading,
    error: state => state.error,
    topSquads: state => state.leaderboard.slice(0, 10),
    squadRank: state => squadId => {
      const index = state.leaderboard.findIndex(s => s.squad_id === squadId)
      return index !== -1 ? index + 1 : null
    }
  }
} 