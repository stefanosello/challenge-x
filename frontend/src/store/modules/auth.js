import { authService } from '@/services/authService'

export default {
  namespaced: true,
  
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    SET_AUTHENTICATED(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await authService.login(credentials)
        commit('SET_USER', response.user)
        commit('SET_TOKEN', response.token)
        commit('SET_AUTHENTICATED', true)
        return response
      } catch (error) {
        throw error
      }
    },
    
    async register({ commit }, userData) {
      try {
        const response = await authService.register(userData)
        commit('SET_USER', response.user)
        commit('SET_TOKEN', response.token)
        commit('SET_AUTHENTICATED', true)
        return response
      } catch (error) {
        throw error
      }
    },
    
    logout({ commit }) {
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
      commit('SET_AUTHENTICATED', false)
    },
    
    async checkAuth({ commit }) {
      try {
        const user = await authService.getCurrentUser()
        commit('SET_USER', user)
        commit('SET_AUTHENTICATED', true)
      } catch (error) {
        commit('SET_USER', null)
        commit('SET_TOKEN', null)
        commit('SET_AUTHENTICATED', false)
      }
    }
  },
  
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    token: state => state.token,
    isAdmin: state => state.user?.role === 'admin' || state.user?.role === 'super_admin',
    isSquadLeader: state => state.user?.role === 'squad_leader',
    isSubChallengeLeader: state => state.user?.role === 'sub_challenge_leader'
  }
} 