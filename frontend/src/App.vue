<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav v-if="isAuthenticated" class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-scout-600">Scout Challenge</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                to="/dashboard" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-scout-500 text-gray-900"
              >
                Dashboard
              </router-link>
              <router-link 
                to="/leaderboard" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-scout-500 text-gray-900"
              >
                Leaderboard
              </router-link>
              <router-link 
                v-if="isAdmin" 
                to="/admin" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-scout-500 text-gray-900"
              >
                Admin
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">{{ currentUser?.name }}</span>
              <button 
                @click="logout" 
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const isAdmin = computed(() => store.getters.isAdmin)
    const currentUser = computed(() => store.state.auth.user)

    const logout = () => {
      store.dispatch('auth/logout')
      router.push('/login')
    }

    return {
      isAuthenticated,
      isAdmin,
      currentUser,
      logout
    }
  }
}
</script> 