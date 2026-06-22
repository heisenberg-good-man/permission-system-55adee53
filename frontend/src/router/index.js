import { createRouter, createWebHistory } from 'vue-router'
import JobList from '../views/JobList.vue'
import JobDetail from '../views/JobDetail.vue'
import JobForm from '../views/JobForm.vue'
import Applications from '../views/Applications.vue'
import Stats from '../views/Stats.vue'

const routes = [
  {
    path: '/',
    name: 'JobList',
    component: JobList
  },
  {
    path: '/job/:id',
    name: 'JobDetail',
    component: JobDetail
  },
  {
    path: '/job/new',
    name: 'JobNew',
    component: JobForm
  },
  {
    path: '/job/edit/:id',
    name: 'JobEdit',
    component: JobForm
  },
  {
    path: '/applications',
    name: 'Applications',
    component: Applications
  },
  {
    path: '/stats',
    name: 'Stats',
    component: Stats
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
