<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">Squad Registration</h1>
      </div>
    </div>

    <!-- Registration Form -->
    <div class="card">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <!-- Squad Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Squad Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="squad_name" class="block text-sm font-medium text-gray-700">Squad Name</label>
                <input
                  id="squad_name"
                  v-model="form.squad_name"
                  type="text"
                  required
                  class="input mt-1"
                  placeholder="Enter squad name"
                />
              </div>
              
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="category"
                  v-model="form.category"
                  required
                  class="input mt-1"
                >
                  <option value="">Select category</option>
                  <option value="Junior">Junior (13-15 years)</option>
                  <option value="Senior">Senior (16-18 years)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Squad Members -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Squad Members (2-4 members)</h3>
            <div class="space-y-4">
              <div 
                v-for="(member, index) in form.members" 
                :key="index"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-sm font-medium text-gray-900">Member {{ index + 1 }}</h4>
                  <button 
                    v-if="form.members.length > 2"
                    type="button"
                    @click="removeMember(index)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label :for="`member_name_${index}`" class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      :id="`member_name_${index}`"
                      v-model="member.name"
                      type="text"
                      required
                      class="input mt-1"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label :for="`member_age_${index}`" class="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      :id="`member_age_${index}`"
                      v-model="member.age"
                      type="number"
                      min="13"
                      max="18"
                      required
                      class="input mt-1"
                      placeholder="Enter age"
                    />
                  </div>
                </div>
              </div>
              
              <button 
                v-if="form.members.length < 4"
                type="button"
                @click="addMember"
                class="btn btn-secondary"
              >
                Add Member
              </button>
            </div>
          </div>

          <!-- Arrival Time Selection -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Estimated Arrival Time</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                v-for="timeSlot in availableTimeSlots" 
                :key="timeSlot.value"
                class="relative"
              >
                <input
                  :id="`time_${timeSlot.value}`"
                  v-model="form.estimated_arrival_time"
                  type="radio"
                  :value="timeSlot.value"
                  :disabled="timeSlot.taken"
                  class="sr-only"
                />
                <label 
                  :for="`time_${timeSlot.value}`"
                  :class="[
                    'block w-full p-4 border rounded-lg cursor-pointer',
                    form.estimated_arrival_time === timeSlot.value
                      ? 'border-primary-500 bg-primary-50'
                      : timeSlot.taken
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-primary-300'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ timeSlot.label }}</div>
                      <div class="text-sm text-gray-500">{{ timeSlot.description }}</div>
                    </div>
                    <div v-if="timeSlot.taken" class="text-xs text-gray-500">Taken</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="$router.push('/dashboard')"
              class="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="loading || !isFormValid"
              class="btn btn-primary"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
              <span v-else>Register Squad</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'SquadRegistration',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const loading = ref(false)
    
    const form = reactive({
      squad_name: '',
      category: '',
      members: [
        { name: '', age: '' },
        { name: '', age: '' }
      ],
      estimated_arrival_time: ''
    })
    
    // Mock available time slots
    const availableTimeSlots = [
      { value: '08:00', label: '8:00 AM', description: 'Early start', taken: false },
      { value: '08:15', label: '8:15 AM', description: 'Early start', taken: true },
      { value: '08:30', label: '8:30 AM', description: 'Standard start', taken: false },
      { value: '08:45', label: '8:45 AM', description: 'Standard start', taken: false },
      { value: '09:00', label: '9:00 AM', description: 'Late start', taken: false },
      { value: '09:15', label: '9:15 AM', description: 'Late start', taken: false }
    ]
    
    const isFormValid = computed(() => {
      return form.squad_name && 
             form.category && 
             form.estimated_arrival_time &&
             form.members.length >= 2 &&
             form.members.length <= 4 &&
             form.members.every(member => member.name && member.age)
    })
    
    const addMember = () => {
      if (form.members.length < 4) {
        form.members.push({ name: '', age: '' })
      }
    }
    
    const removeMember = (index) => {
      if (form.members.length > 2) {
        form.members.splice(index, 1)
      }
    }
    
    const handleSubmit = async () => {
      if (!isFormValid.value) return
      
      loading.value = true
      
      try {
        const squadData = {
          name: form.squad_name,
          category: form.category,
          members: form.members,
          estimated_arrival_time: form.estimated_arrival_time,
          scout_group: store.getters['auth/user']?.scout_group
        }
        
        await store.dispatch('squads/createSquad', squadData)
        router.push('/dashboard')
      } catch (error) {
        console.error('Registration failed:', error)
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      availableTimeSlots,
      isFormValid,
      addMember,
      removeMember,
      handleSubmit
    }
  }
}
</script> 