import { createStore } from 'vuex'
import auth from './modules/auth'
import squads from './modules/squads'
import events from './modules/events'
import leaderboard from './modules/leaderboard'

export default createStore({
  modules: {
    auth,
    squads,
    events,
    leaderboard
  },
  
  state: {
    loading: false,
    error: null
  },
  
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  
  actions: {
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading)
    },
    setError({ commit }, error) {
      commit('SET_ERROR', error)
    }
  },
  
  getters: {
    loading: state => state.loading,
    error: state => state.error
  }
}) 