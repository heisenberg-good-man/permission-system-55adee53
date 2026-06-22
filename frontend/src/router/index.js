import { createRouter, createWebHistory } from 'vue-router'
import JobList from '../views/JobList.vue'
import JobDetail from '../views/JobDetail.vue'
import JobForm from '../views/JobForm.vue'
import Applications from '../views/Applications.vue'
import Stats from '../views/Stats.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'JobList',
    component: JobList,
    meta: { title: '职位列表' }
  },
  {
    path: '/jobs',
    redirect: '/'
  },
  {
    path: '/job/:id',
    name: 'JobDetail',
    component: JobDetail,
    meta: { title: '职位详情' }
  },
  {
    path: '/job/new',
    name: 'JobNew',
    component: JobForm,
    meta: { title: '发布新职位' }
  },
  {
    path: '/job/edit/:id',
    name: 'JobEdit',
    component: JobForm,
    meta: { title: '编辑职位' }
  },
  {
    path: '/applications',
    name: 'Applications',
    component: Applications,
    meta: { title: '投递管理' }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: Stats,
    meta: { title: '数据统计' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title + ' - 招聘平台'
  }
  next()
})

export default router
