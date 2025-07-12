<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Scout Challenge System
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Create your account
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="input mt-1"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="input mt-1"
              placeholder="Email address"
            />
          </div>
          
          <div>
            <label for="scout_group" class="block text-sm font-medium text-gray-700">Scout Group</label>
            <select
              id="scout_group"
              v-model="form.scout_group"
              name="scout_group"
              required
              class="input mt-1"
            >
              <option value="">Select your scout group</option>
              <option value="Group A">Group A</option>
              <option value="Group B">Group B</option>
              <option value="Group C">Group C</option>
              <option value="Group D">Group D</option>
            </select>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="input mt-1"
              placeholder="Password"
            />
          </div>
          
          <div>
            <label for="password_confirm" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="password_confirm"
              v-model="form.password_confirm"
              name="password_confirm"
              type="password"
              required
              class="input mt-1"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !passwordsMatch"
            class="btn btn-primary w-full"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
            <span v-else>Create account</span>
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-sm text-primary-600 hover:text-primary-500">
            Already have an account? Sign in here
          </router-link>
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
  name: 'Register',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const loading = ref(false)
    const error = ref('')
    
    const form = reactive({
      name: '',
      email: '',
      scout_group: '',
      password: '',
      password_confirm: ''
    })
    
    const passwordsMatch = computed(() => {
      return form.password && form.password === form.password_confirm
    })
    
    const handleRegister = async () => {
      if (!passwordsMatch.value) {
        error.value = 'Passwords do not match'
        return
      }
      
      loading.value = true
      error.value = ''
      
      try {
        await store.dispatch('auth/register', {
          name: form.name,
          email: form.email,
          scout_group: form.scout_group,
          password: form.password
        })
        router.push('/dashboard')
      } catch (err) {
        error.value = err.message || 'Registration failed'
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      error,
      passwordsMatch,
      handleRegister
    }
  }
}
</script> 