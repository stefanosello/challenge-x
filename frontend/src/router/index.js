import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'

// Views
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import Leaderboard from '@/views/Leaderboard.vue'
import Admin from '@/views/Admin.vue'
import SquadRegistration from '@/views/SquadRegistration.vue'
import SubChallengeRecording from '@/views/SubChallengeRecording.vue'
import FinishLineValidation from '@/views/FinishLineValidation.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/squad-registration',
    name: 'SquadRegistration',
    component: SquadRegistration,
    meta: { requiresAuth: true }
  },
  {
    path: '/sub-challenge-recording',
    name: 'SubChallengeRecording',
    component: SubChallengeRecording,
    meta: { requiresAuth: true, requiresSubChallengeLeader: true }
  },
  {
    path: '/finish-line-validation',
    name: 'FinishLineValidation',
    component: FinishLineValidation,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useStore()
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const isAdmin = store.getters['auth/isAdmin']
  const isSubChallengeLeader = store.getters['auth/isSubChallengeLeader']

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/dashboard')
  } else if (to.meta.requiresSubChallengeLeader && !isSubChallengeLeader) {
    next('/dashboard')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router 