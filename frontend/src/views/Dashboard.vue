<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">Welcome, {{ user?.name }}!</h1>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-primary-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-primary-900">Role</h3>
          <p class="text-primary-700">{{ user?.role?.replace('_', ' ').toUpperCase() }}</p>
        </div>
        <div class="bg-scout-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-scout-900">Scout Group</h3>
          <p class="text-scout-700">{{ user?.scout_group }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900">Status</h3>
          <p class="text-gray-700">Active</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Quick Actions</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link 
          to="/squad-registration" 
          class="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900">Register Squad</h3>
              <p class="text-sm text-gray-500">Create or join a squad</p>
            </div>
          </div>
        </router-link>

        <router-link 
          to="/leaderboard" 
          class="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900">Leaderboard</h3>
              <p class="text-sm text-gray-500">View current standings</p>
            </div>
          </div>
        </router-link>

        <router-link 
          v-if="isSubChallengeLeader"
          to="/sub-challenge-recording" 
          class="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900">Record Scores</h3>
              <p class="text-sm text-gray-500">Record sub-challenge scores</p>
            </div>
          </div>
        </router-link>

        <router-link 
          v-if="isAdmin"
          to="/admin" 
          class="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900">Admin Panel</h3>
              <p class="text-sm text-gray-500">Manage events and users</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Recent Activity</h2>
      </div>
      <div class="space-y-4">
        <div class="flex items-center p-4 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 bg-scout-100 rounded-full flex items-center justify-center">
              <svg class="h-5 w-5 text-scout-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-900">Spring Orienteering Challenge 2024</p>
            <p class="text-sm text-gray-500">Event starts in 2 days</p>
          </div>
        </div>
        
        <div class="flex items-center p-4 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-900">Squad Registration Open</p>
            <p class="text-sm text-gray-500">Register your squad before January 10th</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()
    
    const user = computed(() => store.getters['auth/user'])
    const isAdmin = computed(() => store.getters['auth/isAdmin'])
    const isSubChallengeLeader = computed(() => store.getters['auth/isSubChallengeLeader'])
    
    onMounted(async () => {
      // Load initial data
      await store.dispatch('events/fetchEvents')
      await store.dispatch('squads/fetchSquads')
    })
    
    return {
      user,
      isAdmin,
      isSubChallengeLeader
    }
  }
}
</script> 