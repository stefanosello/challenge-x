<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">Finish Line Validation</h1>
        <p class="text-sm text-gray-600">Verify checkpoint completion and record final performances</p>
      </div>
    </div>

    <!-- Squad Search -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Find Squad</h2>
      </div>
      <div class="flex space-x-4">
        <div class="flex-1">
          <label for="squad_search" class="block text-sm font-medium text-gray-700">Search by Squad Name or ID</label>
          <input
            id="squad_search"
            v-model="searchQuery"
            type="text"
            class="input mt-1"
            placeholder="Enter squad name or ID"
            @input="searchSquads"
          />
        </div>
        <div class="flex items-end">
          <button 
            @click="searchSquads"
            class="btn btn-primary"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <!-- Squad Results -->
    <div v-if="searchResults.length > 0" class="card">
      <div class="card-header">
        <h2 class="card-title">Search Results</h2>
      </div>
      <div class="space-y-4">
        <div 
          v-for="squad in searchResults" 
          :key="squad.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 cursor-pointer"
          @click="selectSquad(squad)"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ squad.name }}</h3>
              <p class="text-sm text-gray-500">{{ squad.scout_group }} - {{ squad.category }}</p>
              <p class="text-sm text-gray-500">{{ squad.members.length }} members</p>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500">Estimated arrival: {{ formatTime(squad.estimated_arrival_time) }}</div>
              <div class="text-sm text-gray-500">Status: {{ squad.status }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Form -->
    <div v-if="selectedSquad" class="card">
      <div class="card-header">
        <h2 class="card-title">Validate {{ selectedSquad.name }}</h2>
      </div>
      
      <form @submit.prevent="handleValidation" class="space-y-6">
        <!-- Checkpoint Verification -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Checkpoint Verification</h3>
          <div class="space-y-4">
            <div 
              v-for="checkpoint in checkpoints" 
              :key="checkpoint.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ checkpoint.name }}</h4>
                  <p class="text-sm text-gray-500">{{ checkpoint.description }}</p>
                </div>
                <div class="flex items-center space-x-4">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="verification.checkpoints[checkpoint.id]"
                      class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Verified</span>
                  </label>
                  <div v-if="checkpoint.has_sub_challenge" class="text-xs text-scout-600">
                    Sub-Challenge
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paper Verification -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Paper Verification</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="paper_condition" class="block text-sm font-medium text-gray-700">Paper Condition</label>
              <select
                id="paper_condition"
                v-model="verification.paper_condition"
                required
                class="input mt-1"
              >
                <option value="">Select condition</option>
                <option value="excellent">Excellent - No damage</option>
                <option value="good">Good - Minor wear</option>
                <option value="fair">Fair - Some damage</option>
                <option value="poor">Poor - Significant damage</option>
                <option value="missing">Missing</option>
              </select>
            </div>
            
            <div>
              <label for="obliteration_quality" class="block text-sm font-medium text-gray-700">Obliteration Quality</label>
              <select
                id="obliteration_quality"
                v-model="verification.obliteration_quality"
                required
                class="input mt-1"
              >
                <option value="">Select quality</option>
                <option value="excellent">Excellent - Clear marks</option>
                <option value="good">Good - Readable marks</option>
                <option value="fair">Fair - Partially readable</option>
                <option value="poor">Poor - Difficult to read</option>
                <option value="none">No obliteration</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Final Performance -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Final Performance</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="actual_arrival_time" class="block text-sm font-medium text-gray-700">Actual Arrival Time</label>
              <input
                id="actual_arrival_time"
                v-model="verification.actual_arrival_time"
                type="datetime-local"
                required
                class="input mt-1"
              />
            </div>
            
            <div>
              <label for="total_time" class="block text-sm font-medium text-gray-700">Total Time (minutes)</label>
              <input
                id="total_time"
                v-model="verification.total_time"
                type="number"
                min="0"
                required
                class="input mt-1"
                placeholder="Enter total time"
              />
            </div>
            
            <div>
              <label for="final_score" class="block text-sm font-medium text-gray-700">Final Score</label>
              <input
                id="final_score"
                v-model="verification.final_score"
                type="number"
                min="0"
                max="100"
                required
                class="input mt-1"
                placeholder="Enter final score"
              />
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label for="validation_notes" class="block text-sm font-medium text-gray-700">Validation Notes</label>
          <textarea
            id="validation_notes"
            v-model="verification.notes"
            rows="3"
            class="input mt-1"
            placeholder="Any notes about the validation process"
          ></textarea>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="resetValidation"
            class="btn btn-secondary"
          >
            Reset
          </button>
          <button 
            type="submit" 
            :disabled="loading || !isValidationValid"
            class="btn btn-success"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Validating...
            </span>
            <span v-else>Complete Validation</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Recent Validations -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Recent Validations</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Squad
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrival Time
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Time
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Final Score
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="validation in recentValidations" :key="validation.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ validation.squad_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatTime(validation.arrival_time) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ validation.total_time }} min
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ validation.final_score }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    validation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                  ]"
                >
                  {{ validation.status }}
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
  name: 'FinishLineValidation',
  setup() {
    const store = useStore()
    
    const loading = ref(false)
    const searchQuery = ref('')
    const searchResults = ref([])
    const selectedSquad = ref(null)
    
    const verification = reactive({
      checkpoints: {},
      paper_condition: '',
      obliteration_quality: '',
      actual_arrival_time: '',
      total_time: '',
      final_score: '',
      notes: ''
    })
    
    const checkpoints = computed(() => store.getters['events/checkpoints'])
    const squads = computed(() => store.getters['squads/squads'])
    
    const isValidationValid = computed(() => {
      return selectedSquad.value &&
             verification.paper_condition &&
             verification.obliteration_quality &&
             verification.actual_arrival_time &&
             verification.total_time &&
             verification.final_score
    })
    
    // Mock recent validations
    const recentValidations = ref([
      {
        id: '1',
        squad_name: 'Eagle Squad',
        arrival_time: '2024-01-15T12:30:00Z',
        total_time: 270,
        final_score: 92.5,
        status: 'completed'
      },
      {
        id: '2',
        squad_name: 'Wolf Pack',
        arrival_time: '2024-01-15T13:00:00Z',
        total_time: 285,
        final_score: 84.2,
        status: 'completed'
      }
    ])
    
    const searchSquads = () => {
      if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
      }
      
      const query = searchQuery.value.toLowerCase()
      searchResults.value = squads.value.filter(squad => 
        squad.name.toLowerCase().includes(query) ||
        squad.id.toLowerCase().includes(query)
      )
    }
    
    const selectSquad = (squad) => {
      selectedSquad.value = squad
      searchResults.value = []
      searchQuery.value = ''
      
      // Initialize checkpoint verification
      checkpoints.value.forEach(checkpoint => {
        verification.checkpoints[checkpoint.id] = false
      })
    }
    
    const resetValidation = () => {
      Object.assign(verification, {
        checkpoints: {},
        paper_condition: '',
        obliteration_quality: '',
        actual_arrival_time: '',
        total_time: '',
        final_score: '',
        notes: ''
      })
      selectedSquad.value = null
    }
    
    const handleValidation = async () => {
      if (!isValidationValid.value) return
      
      loading.value = true
      
      try {
        const validationData = {
          squad_id: selectedSquad.value.id,
          checkpoints: verification.checkpoints,
          paper_condition: verification.paper_condition,
          obliteration_quality: verification.obliteration_quality,
          actual_arrival_time: verification.actual_arrival_time,
          total_time: parseInt(verification.total_time),
          final_score: parseInt(verification.final_score),
          notes: verification.notes
        }
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Add to recent validations
        const newValidation = {
          id: Date.now().toString(),
          squad_name: selectedSquad.value.name,
          arrival_time: verification.actual_arrival_time,
          total_time: parseInt(verification.total_time),
          final_score: parseInt(verification.final_score),
          status: 'completed'
        }
        
        recentValidations.value.unshift(newValidation)
        
        resetValidation()
      } catch (error) {
        console.error('Validation failed:', error)
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
    })
    
    return {
      loading,
      searchQuery,
      searchResults,
      selectedSquad,
      verification,
      checkpoints,
      squads,
      recentValidations,
      isValidationValid,
      searchSquads,
      selectSquad,
      resetValidation,
      handleValidation,
      formatTime
    }
  }
}
</script> 