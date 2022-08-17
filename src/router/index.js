import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import ConfirmRegistration from '../views/ConfirmRegistration.vue'
import Login from '../views/Login.vue'
import CreateProgram from '../views/admin/CreateProgram.vue'
import Program from '../views/Program.vue'
import Ting from '../views/Ting.vue'
import ProgramList from '../views/admin/ProgramList.vue'
import TingList from '../views/admin/TingList.vue'
import Settings from '../views/admin/Settings.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/confirmRegistration',
    name: 'ConfirmRegistration',
    component: ConfirmRegistration
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/programs/:id',
    name: 'Program',
    component: Program
  },
  {
    path: '/tings/:id',
    name: 'Ting',
    component: Ting
  },
  {
    path: '/admin/createProgram',
    name: 'CreateProgram',
    component: CreateProgram,
    meta: {
      loginRequired: true
    }
  },
  {
    path: '/admin/programs',
    name: 'ProgramList',
    component: ProgramList,
    meta: {
      loginRequired: true
    }
  },
  {
    path: '/admin/programs/:programId/tings',
    name: 'TingList',
    component: TingList,
    meta: {
      loginRequired: true
    }
  },
  {
    path: '/admin/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      loginRequired: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.loginRequired)) {
    if (store.state.me) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
