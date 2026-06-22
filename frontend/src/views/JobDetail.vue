<template>
  <div class="job-detail-page">
    <div class="back-link" @click="goBack">← 返回列表</div>

    <div v-if="loading" class="card loading">加载中...</div>

    <div v-else-if="error" class="card">
      <div class="error-message">{{ error }}</div>
    </div>

    <div v-else-if="job" class="card">
      <div class="detail-header">
        <div>
          <h1 class="detail-title">{{ job.title }}</h1>
          <div class="detail-company">{{ job.company }}</div>
          <div class="detail-tags">
            <span class="detail-tag">📍 {{ job.city }}</span>
            <span class="detail-tag">💼 {{ job.experience }}</span>
            <span class="detail-tag">🎓 {{ job.education }}</span>
            <span class="status-badge" :class="'status-' + job.status">
              {{ job.status === 'open' ? '招聘中' : '已关闭' }}
            </span>
          </div>
        </div>
        <div class="detail-salary">{{ job.salary }}</div>
      </div>

      <div class="detail-section">
        <h3 class="detail-section-title">职位描述</h3>
        <div class="detail-section-content">{{ job.description || '暂无描述' }}</div>
      </div>

      <div class="detail-section">
        <h3 class="detail-section-title">任职要求</h3>
        <div class="detail-section-content">{{ job.requirements || '暂无要求' }}</div>
      </div>

      <div class="detail-section">
        <h3 class="detail-section-title">福利待遇</h3>
        <div class="detail-section-content">{{ job.benefits || '暂无福利信息' }}</div>
      </div>

      <div class="detail-section">
        <div style="color: #a0aec0; font-size: 14px;">
          发布时间：{{ job.createdAt }} | 浏览次数：{{ job.views }}
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <button 
          v-if="currentRole === 'applicant'"
          class="btn btn-primary" 
          :disabled="job.status === 'closed'"
          @click="showApplyModal = true"
          style="padding: 12px 40px; font-size: 16px;"
        >
          {{ job.status === 'closed' ? '职位已关闭' : '立即投递' }}
        </button>
        <template v-else>
          <button class="btn btn-secondary" @click="editJob">编辑职位</button>
          <button 
            class="btn" 
            :class="job.status === 'open' ? 'btn-danger' : 'btn-success'"
            @click="toggleStatus"
            style="margin-left: 12px;"
          >
            {{ job.status === 'open' ? '关闭职位' : '开启职位' }}
          </button>
        </template>
      </div>
    </div>

    <div v-if="showApplyModal" class="modal-overlay" @click.self="showApplyModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">投递简历 - {{ job?.title }}</h3>
          <button class="modal-close" @click="showApplyModal = false">&times;</button>
        </div>

        <div v-if="applyError" class="error-message">{{ applyError }}</div>
        <div v-if="applySuccess" class="success-message">投递成功！我们会尽快与您联系。</div>

        <form @submit.prevent="submitApplication" v-if="!applySuccess">
          <div class="form-group">
            <label class="form-label">姓名 <span style="color: #e53e3e;">*</span></label>
            <input type="text" class="form-input" v-model="form.applicantName" required />
          </div>
          <div class="form-group">
            <label class="form-label">邮箱 <span style="color: #e53e3e;">*</span></label>
            <input type="email" class="form-input" v-model="form.email" required />
          </div>
          <div class="form-group">
            <label class="form-label">手机号 <span style="color: #e53e3e;">*</span></label>
            <input type="tel" class="form-input" v-model="form.phone" required />
          </div>
          <div class="form-group">
            <label class="form-label">工作经验</label>
            <select class="form-select" v-model="form.experience">
              <option value="不限">不限</option>
              <option value="应届生">应届生</option>
              <option value="1年以内">1年以内</option>
              <option value="1-3年">1-3年</option>
              <option value="3-5年">3-5年</option>
              <option value="5-10年">5-10年</option>
              <option value="10年以上">10年以上</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">学历</label>
            <select class="form-select" v-model="form.education">
              <option value="不限">不限</option>
              <option value="大专">大专</option>
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">简历介绍 <span style="color: #e53e3e;">*</span></label>
            <textarea 
              class="form-textarea" 
              v-model="form.resume" 
              rows="5"
              placeholder="请简要介绍您的工作经历和技能..."
              required
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showApplyModal = false">取消</button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? '提交中...' : '提交投递' }}
            </button>
          </div>
        </form>

        <div v-else class="modal-footer">
          <button class="btn btn-primary" @click="closeAndGoToList">查看我的投递</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { jobApi, applicationApi } from '../utils/api'

export default {
  name: 'JobDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const currentRole = inject('currentRole')

    const job = ref(null)
    const loading = ref(false)
    const error = ref('')
    const showApplyModal = ref(false)
    const applyError = ref('')
    const applySuccess = ref(false)
    const submitting = ref(false)

    const form = reactive({
      applicantName: '',
      email: '',
      phone: '',
      experience: '不限',
      education: '不限',
      resume: ''
    })

    const fetchJob = async () => {
      loading.value = true
      error.value = ''
      try {
        const data = await jobApi.getDetail(route.params.id)
        job.value = data
      } catch (err) {
        error.value = err.error || '获取职位详情失败'
      } finally {
        loading.value = false
      }
    }

    const goBack = () => {
      router.back()
    }

    const editJob = () => {
      router.push(`/job/edit/${job.value.id}`)
    }

    const toggleStatus = async () => {
      const newStatus = job.value.status === 'open' ? 'closed' : 'open'
      try {
        await jobApi.updateStatus(job.value.id, newStatus)
        job.value.status = newStatus
      } catch (err) {
        console.error('更新状态失败:', err)
      }
    }

    const submitApplication = async () => {
      if (!form.applicantName || !form.email || !form.phone || !form.resume) {
        applyError.value = '请填写所有必填项'
        return
      }

      submitting.value = true
      applyError.value = ''

      try {
        await applicationApi.create({
          ...form,
          jobId: route.params.id
        })
        applySuccess.value = true
      } catch (err) {
        applyError.value = err.error || '投递失败，请重试'
      } finally {
        submitting.value = false
      }
    }

    const closeAndGoToList = () => {
      showApplyModal.value = false
      router.push('/applications')
    }

    onMounted(() => {
      fetchJob()
    })

    return {
      job,
      loading,
      error,
      currentRole,
      showApplyModal,
      applyError,
      applySuccess,
      submitting,
      form,
      goBack,
      editJob,
      toggleStatus,
      submitApplication,
      closeAndGoToList
    }
  }
}
</script>
