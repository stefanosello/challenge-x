import { squadService } from '@/services/squadService'

export default {
  namespaced: true,
  
  state: {
    squads: [],
    currentSquad: null,
    loading: false,
    error: null
  },
  
  mutations: {
    SET_SQUADS(state, squads) {
      state.squads = squads
    },
    SET_CURRENT_SQUAD(state, squad) {
      state.currentSquad = squad
    },
    ADD_SQUAD(state, squad) {
      state.squads.push(squad)
    },
    UPDATE_SQUAD(state, updatedSquad) {
      const index = state.squads.findIndex(s => s.id === updatedSquad.id)
      if (index !== -1) {
        state.squads[index] = updatedSquad
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  
  actions: {
    async fetchSquads({ commit }) {
      commit('SET_LOADING', true)
      try {
        const squads = await squadService.getSquads()
        commit('SET_SQUADS', squads)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async createSquad({ commit }, squadData) {
      commit('SET_LOADING', true)
      try {
        const squad = await squadService.createSquad(squadData)
        commit('ADD_SQUAD', squad)
        return squad
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async updateSquad({ commit }, { id, data }) {
      commit('SET_LOADING', true)
      try {
        const squad = await squadService.updateSquad(id, data)
        commit('UPDATE_SQUAD', squad)
        return squad
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async getSquad({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        const squad = await squadService.getSquad(id)
        commit('SET_CURRENT_SQUAD', squad)
        return squad
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  
  getters: {
    squads: state => state.squads,
    currentSquad: state => state.currentSquad,
    loading: state => state.loading,
    error: state => state.error,
    squadById: state => id => state.squads.find(s => s.id === id)
  }
} 