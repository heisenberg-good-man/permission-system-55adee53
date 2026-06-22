<template>
  <div class="job-list-page">
    <div class="page-header">
      <h1 class="page-title">职位列表</h1>
    </div>

    <div class="card">
      <div class="filter-bar">
        <div class="form-group">
          <label class="form-label">岗位名称</label>
          <input 
            type="text" 
            class="form-input" 
            v-model="filters.keyword" 
            placeholder="请输入关键词"
            @keyup.enter="fetchJobs"
          />
        </div>
        <div class="form-group">
          <label class="form-label">城市</label>
          <select class="form-select" v-model="filters.city" @change="fetchJobs">
            <option value="">全部城市</option>
            <option value="北京">北京</option>
            <option value="上海">上海</option>
            <option value="深圳">深圳</option>
            <option value="杭州">杭州</option>
            <option value="广州">广州</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">状态</label>
          <select class="form-select" v-model="filters.status" @change="fetchJobs">
            <option value="">全部状态</option>
            <option value="open">招聘中</option>
            <option value="closed">已关闭</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">&nbsp;</label>
          <button class="btn btn-primary" @click="fetchJobs">搜索</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="card loading">加载中...</div>

    <div v-else-if="jobs.length === 0" class="card empty-state">
      <div class="empty-state-icon">📭</div>
      <div class="empty-state-text">暂无符合条件的职位</div>
    </div>

    <div v-else class="job-list">
      <div 
        v-for="job in jobs" 
        :key="job.id" 
        class="job-item"
        @click="goToDetail(job.id)"
      >
        <div class="job-item-header">
          <div>
            <div class="job-title">{{ job.title }}</div>
            <div class="job-company">{{ job.company }}</div>
          </div>
          <div>
            <div class="job-salary">{{ job.salary }}</div>
          </div>
        </div>
        <div class="job-meta">
          <span class="job-meta-item">📍 {{ job.city }}</span>
          <span class="job-meta-item">💼 {{ job.experience }}</span>
          <span class="job-meta-item">🎓 {{ job.education }}</span>
          <span class="job-meta-item">👁️ {{ job.views }} 浏览</span>
          <span class="status-badge" :class="'status-' + job.status">
            {{ job.status === 'open' ? '招聘中' : '已关闭' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jobApi } from '../utils/api'

export default {
  name: 'JobList',
  setup() {
    const router = useRouter()
    const jobs = ref([])
    const loading = ref(false)
    const filters = reactive({
      keyword: '',
      city: '',
      status: ''
    })

    const fetchJobs = async () => {
      loading.value = true
      try {
        const params = {}
        if (filters.keyword) params.keyword = filters.keyword
        if (filters.city) params.city = filters.city
        if (filters.status) params.status = filters.status
        const data = await jobApi.getList(params)
        jobs.value = data
      } catch (err) {
        console.error('获取职位列表失败:', err)
      } finally {
        loading.value = false
      }
    }

    const goToDetail = (id) => {
      router.push(`/job/${id}`)
    }

    onMounted(() => {
      fetchJobs()
    })

    return {
      jobs,
      loading,
      filters,
      fetchJobs,
      goToDetail
    }
  }
}
</script>
