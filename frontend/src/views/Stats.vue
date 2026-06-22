<template>
  <div class="stats-page">
    <div class="page-header">
      <h1 class="page-title">数据统计</h1>
    </div>

    <div v-if="loading" class="card loading">加载中...</div>

    <template v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalJobs }}</div>
          <div class="stat-label">职位总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" style="color: #48bb78;">{{ stats.openJobs }}</div>
          <div class="stat-label">招聘中职位</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" style="color: #ed8936;">{{ stats.totalApplications }}</div>
          <div class="stat-label">总投递数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" style="color: #f56565;">{{ stats.pendingApplications }}</div>
          <div class="stat-label">待处理投递</div>
        </div>
      </div>

      <div class="card">
        <h3 class="detail-section-title" style="margin-bottom: 20px;">平台概览</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
            <div style="font-size: 16px; font-weight: 500; margin-bottom: 12px; color: #2d3748;">
              职位状态分布
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #718096;">招聘中</span>
              <span style="font-weight: 500;">{{ stats.openJobs }} 个</span>
            </div>
            <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
              <div 
                style="height: 100%; background: #48bb78; border-radius: 4px; transition: width 0.5s;"
                :style="{ width: jobOpenRate + '%' }"
              ></div>
            </div>
            <div style="font-size: 12px; color: #a0aec0; margin-top: 4px;">
              占比 {{ jobOpenRate.toFixed(1) }}%
            </div>

            <div style="display: flex; justify-content: space-between; margin: 16px 0 8px;">
              <span style="color: #718096;">已关闭</span>
              <span style="font-weight: 500;">{{ stats.totalJobs - stats.openJobs }} 个</span>
            </div>
            <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
              <div 
                style="height: 100%; background: #f56565; border-radius: 4px; transition: width 0.5s;"
                :style="{ width: (100 - jobOpenRate) + '%' }"
              ></div>
            </div>
          </div>

          <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
            <div style="font-size: 16px; font-weight: 500; margin-bottom: 12px; color: #2d3748;">
              投递处理进度
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #718096;">待处理</span>
              <span style="font-weight: 500;">{{ stats.pendingApplications }} 份</span>
            </div>
            <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
              <div 
                style="height: 100%; background: #f6ad55; border-radius: 4px; transition: width 0.5s;"
                :style="{ width: pendingRate + '%' }"
              ></div>
            </div>
            <div style="font-size: 12px; color: #a0aec0; margin-top: 4px;">
              占比 {{ pendingRate.toFixed(1) }}%
            </div>

            <div style="display: flex; justify-content: space-between; margin: 16px 0 8px;">
              <span style="color: #718096;">已处理</span>
              <span style="font-weight: 500;">{{ stats.totalApplications - stats.pendingApplications }} 份</span>
            </div>
            <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
              <div 
                style="height: 100%; background: #48bb78; border-radius: 4px; transition: width 0.5s;"
                :style="{ width: (100 - pendingRate) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="detail-section-title" style="margin-bottom: 20px;">快捷操作</h3>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <button class="btn btn-primary" @click="goToNewJob">
            发布新职位
          </button>
          <button class="btn btn-secondary" @click="goToApplications">
            查看投递记录
          </button>
          <button class="btn btn-secondary" @click="goToJobList">
            浏览职位列表
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jobApi } from '../utils/api'

export default {
  name: 'Stats',
  setup() {
    const router = useRouter()
    const stats = ref({
      totalJobs: 0,
      openJobs: 0,
      totalApplications: 0,
      pendingApplications: 0
    })
    const loading = ref(false)

    const jobOpenRate = computed(() => {
      if (stats.value.totalJobs === 0) return 0
      return (stats.value.openJobs / stats.value.totalJobs) * 100
    })

    const pendingRate = computed(() => {
      if (stats.value.totalApplications === 0) return 0
      return (stats.value.pendingApplications / stats.value.totalApplications) * 100
    })

    const fetchStats = async () => {
      loading.value = true
      try {
        const data = await jobApi.getStats()
        stats.value = data
      } catch (err) {
        console.error('获取统计数据失败:', err)
      } finally {
        loading.value = false
      }
    }

    const goToNewJob = () => {
      router.push('/job/new')
    }

    const goToApplications = () => {
      router.push('/applications')
    }

    const goToJobList = () => {
      router.push('/')
    }

    onMounted(() => {
      fetchStats()
    })

    return {
      stats,
      loading,
      jobOpenRate,
      pendingRate,
      goToNewJob,
      goToApplications,
      goToJobList
    }
  }
}
</script>
