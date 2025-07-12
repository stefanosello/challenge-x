import { eventService } from '@/services/eventService'

export default {
  namespaced: true,
  
  state: {
    events: [],
    currentEvent: null,
    checkpoints: [],
    loading: false,
    error: null
  },
  
  mutations: {
    SET_EVENTS(state, events) {
      state.events = events
    },
    SET_CURRENT_EVENT(state, event) {
      state.currentEvent = event
    },
    SET_CHECKPOINTS(state, checkpoints) {
      state.checkpoints = checkpoints
    },
    ADD_EVENT(state, event) {
      state.events.push(event)
    },
    UPDATE_EVENT(state, updatedEvent) {
      const index = state.events.findIndex(e => e.id === updatedEvent.id)
      if (index !== -1) {
        state.events[index] = updatedEvent
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
    async fetchEvents({ commit }) {
      commit('SET_LOADING', true)
      try {
        const events = await eventService.getEvents()
        commit('SET_EVENTS', events)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async getEvent({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        const event = await eventService.getEvent(id)
        commit('SET_CURRENT_EVENT', event)
        return event
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async fetchCheckpoints({ commit }, eventId) {
      commit('SET_LOADING', true)
      try {
        const checkpoints = await eventService.getCheckpoints(eventId)
        commit('SET_CHECKPOINTS', checkpoints)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  
  getters: {
    events: state => state.events,
    currentEvent: state => state.currentEvent,
    checkpoints: state => state.checkpoints,
    loading: state => state.loading,
    error: state => state.error,
    eventById: state => id => state.events.find(e => e.id === id)
  }
} 