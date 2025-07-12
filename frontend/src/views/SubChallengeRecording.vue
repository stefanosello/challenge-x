<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">Sub-Challenge Recording</h1>
        <p class="text-sm text-gray-600">Record arrival, departure, and scores for sub-challenges</p>
      </div>
    </div>

    <!-- Offline Status -->
    <div v-if="isOffline" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">Offline Mode</h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>You are currently offline. Data will be synced when connection is restored.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkpoint Selection -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Select Checkpoint</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="checkpoint in checkpointsWithSubChallenges" 
          :key="checkpoint.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 cursor-pointer"
          :class="{ 'border-primary-500 bg-primary-50': selectedCheckpoint?.id === checkpoint.id }"
          @click="selectCheckpoint(checkpoint)"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">{{ checkpoint.name }}</h3>
              <p class="text-sm text-gray-500">{{ checkpoint.description }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-scout-100 text-scout-800">
                Sub-Challenge
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recording Form -->
    <div v-if="selectedCheckpoint" class="card">
      <div class="card-header">
        <h2 class="card-title">Record for {{ selectedCheckpoint.name }}</h2>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Squad Selection -->
        <div>
          <label for="squad" class="block text-sm font-medium text-gray-700">Squad</label>
          <select
            id="squad"
            v-model="form.squad_id"
            required
            class="input mt-1"
          >
            <option value="">Select a squad</option>
            <option 
              v-for="squad in squads" 
              :key="squad.id" 
              :value="squad.id"
            >
              {{ squad.name }} ({{ squad.scout_group }})
            </option>
          </select>
        </div>

        <!-- Arrival Time -->
        <div>
          <label for="arrival_time" class="block text-sm font-medium text-gray-700">Arrival Time</label>
          <input
            id="arrival_time"
            v-model="form.arrival_time"
            type="datetime-local"
            required
            class="input mt-1"
          />
        </div>

        <!-- Departure Time -->
        <div>
          <label for="departure_time" class="block text-sm font-medium text-gray-700">Departure Time</label>
          <input
            id="departure_time"
            v-model="form.departure_time"
            type="datetime-local"
            required
            class="input mt-1"
          />
        </div>

        <!-- Score -->
        <div>
          <label for="score" class="block text-sm font-medium text-gray-700">Score (0-100)</label>
          <input
            id="score"
            v-model="form.score"
            type="number"
            min="0"
            max="100"
            required
            class="input mt-1"
            placeholder="Enter score"
          />
        </div>

        <!-- Notes -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            class="input mt-1"
            placeholder="Optional notes about the sub-challenge"
          ></textarea>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="resetForm"
            class="btn btn-secondary"
          >
            Reset
          </button>
          <button 
            type="submit" 
            :disabled="loading || !isFormValid"
            class="btn btn-success"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Recording...
            </span>
            <span v-else>Record Score</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Recent Recordings -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Recent Recordings</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Squad
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Checkpoint
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrival
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departure
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="recording in recentRecordings" :key="recording.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ recording.squad_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ recording.checkpoint_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatTime(recording.arrival_time) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatTime(recording.departure_time) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ recording.score }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    recording.synced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                  ]"
                >
                  {{ recording.synced ? 'Synced' : 'Pending' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'SubChallengeRecording',
  setup() {
    const store = useStore()
    
    const loading = ref(false)
    const isOffline = ref(false)
    const selectedCheckpoint = ref(null)
    
    const form = reactive({
      squad_id: '',
      arrival_time: '',
      departure_time: '',
      score: '',
      notes: ''
    })
    
    const checkpoints = computed(() => store.getters['events/checkpoints'])
    const squads = computed(() => store.getters['squads/squads'])
    
    const checkpointsWithSubChallenges = computed(() => {
      return checkpoints.value.filter(c => c.has_sub_challenge)
    })
    
    const isFormValid = computed(() => {
      return form.squad_id && 
             form.arrival_time && 
             form.departure_time && 
             form.score &&
             selectedCheckpoint.value
    })
    
    // Mock recent recordings
    const recentRecordings = ref([
      {
        id: '1',
        squad_name: 'Eagle Squad',
        checkpoint_name: 'Lake View',
        arrival_time: '2024-01-15T09:30:00Z',
        departure_time: '2024-01-15T09:45:00Z',
        score: 85,
        synced: true
      },
      {
        id: '2',
        squad_name: 'Wolf Pack',
        checkpoint_name: 'Mountain Peak',
        arrival_time: '2024-01-15T10:15:00Z',
        departure_time: '2024-01-15T10:30:00Z',
        score: 92,
        synced: false
      }
    ])
    
    const selectCheckpoint = (checkpoint) => {
      selectedCheckpoint.value = checkpoint
    }
    
    const resetForm = () => {
      Object.assign(form, {
        squad_id: '',
        arrival_time: '',
        departure_time: '',
        score: '',
        notes: ''
      })
      selectedCheckpoint.value = null
    }
    
    const handleSubmit = async () => {
      if (!isFormValid.value) return
      
      loading.value = true
      
      try {
        const recordingData = {
          checkpoint_id: selectedCheckpoint.value.id,
          squad_id: form.squad_id,
          arrival_time: form.arrival_time,
          departure_time: form.departure_time,
          score: parseInt(form.score),
          notes: form.notes
        }
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Add to recent recordings
        const newRecording = {
          id: Date.now().toString(),
          squad_name: squads.value.find(s => s.id === form.squad_id)?.name || 'Unknown Squad',
          checkpoint_name: selectedCheckpoint.value.name,
          arrival_time: form.arrival_time,
          departure_time: form.departure_time,
          score: parseInt(form.score),
          synced: !isOffline.value
        }
        
        recentRecordings.value.unshift(newRecording)
        
        resetForm()
      } catch (error) {
        console.error('Recording failed:', error)
      } finally {
        loading.value = false
      }
    }
    
    const formatTime = (timeString) => {
      return new Date(timeString).toLocaleTimeString()
    }
    
    onMounted(async () => {
      await store.dispatch('events/fetchCheckpoints', '1') // Mock event ID
      await store.dispatch('squads/fetchSquads')
      
      // Check online status
      isOffline.value = !navigator.onLine
      
      window.addEventListener('online', () => {
        isOffline.value = false
      })
      
      window.addEventListener('offline', () => {
        isOffline.value = true
      })
    })
    
    return {
      loading,
      isOffline,
      selectedCheckpoint,
      form,
      checkpointsWithSubChallenges,
      squads,
      recentRecordings,
      isFormValid,
      selectCheckpoint,
      resetForm,
      handleSubmit,
      formatTime
    }
  }
}
</script> 