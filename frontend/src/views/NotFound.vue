<template>
  <div class="not-found-page">
    <div class="card" style="text-align: center; padding: 60px 40px;">
      <div style="font-size: 72px; margin-bottom: 16px;">🔍</div>
      <h1 class="page-title" style="margin-bottom: 12px;">页面未找到</h1>
      <p style="color: #718096; margin-bottom: 32px; font-size: 16px;">
        您访问的路径「{{ currentPath }}」不存在，或服务暂时不可用
      </p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-primary" @click="goHome">返回首页</button>
        <button class="btn btn-secondary" @click="goBack">返回上一页</button>
        <router-link to="/applications" class="btn btn-secondary">查看投递</router-link>
      </div>
      <div v-if="showApiStatus" style="margin-top: 32px; padding: 16px; background: #f7fafc; border-radius: 8px; text-align: left;">
        <div style="font-weight: 500; margin-bottom: 8px; color: #4a5568;">后端服务状态检查</div>
        <div :style="{ color: apiOk ? '#48bb78' : '#f56565' }">
          {{ apiOk ? '✅ 后端服务连接正常 (http://localhost:' + backendPort + ')' : '❌ 后端服务未连通，请检查 http://localhost:' + backendPort }}
        </div>
        <div style="margin-top: 8px; color: #718096; font-size: 14px;">
          前端地址: http://localhost:{{ frontendPort }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../utils/api'

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const apiOk = ref(false)
    const currentRole = inject('currentRole', ref('applicant'))
    const showApiStatus = computed(() => route.path !== '/' && route.path !== '/jobs')

    const currentPath = computed(() => route.path)
    const backendPort = 3001
    const frontendPort = 5173

    const goHome = () => {
      router.push('/')
    }

    const goBack = () => {
      router.back()
    }

    onMounted(async () => {
      try {
        await api.get('/health')
        apiOk.value = true
      } catch (e) {
        apiOk.value = false
      }
    })

    return {
      currentPath,
      apiOk,
      backendPort,
      frontendPort,
      showApiStatus,
      goHome,
      goBack
    }
  }
}
</script>
