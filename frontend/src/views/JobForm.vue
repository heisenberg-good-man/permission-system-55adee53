<template>
  <div class="job-form-page">
    <div class="back-link" @click="goBack">← 返回</div>

    <div class="card">
      <h1 class="page-title">{{ isEdit ? '编辑职位' : '发布新职位' }}</h1>

      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">保存成功！</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">职位名称 <span style="color: #e53e3e;">*</span></label>
          <input 
            type="text" 
            class="form-input" 
            v-model="form.title" 
            placeholder="请输入职位名称"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">公司名称 <span style="color: #e53e3e;">*</span></label>
          <input 
            type="text" 
            class="form-input" 
            v-model="form.company" 
            placeholder="请输入公司名称"
            required
          />
        </div>

        <div class="form-group" style="display: flex; gap: 16px;">
          <div style="flex: 1;">
            <label class="form-label">工作城市 <span style="color: #e53e3e;">*</span></label>
            <select class="form-select" v-model="form.city" required>
              <option value="">请选择城市</option>
              <option value="北京">北京</option>
              <option value="上海">上海</option>
              <option value="深圳">深圳</option>
              <option value="杭州">杭州</option>
              <option value="广州">广州</option>
              <option value="成都">成都</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div style="flex: 1;">
            <label class="form-label">薪资范围 <span style="color: #e53e3e;">*</span></label>
            <input 
              type="text" 
              class="form-input" 
              v-model="form.salary" 
              placeholder="例如：15k-25k"
              required
            />
          </div>
        </div>

        <div class="form-group" style="display: flex; gap: 16px;">
          <div style="flex: 1;">
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
          <div style="flex: 1;">
            <label class="form-label">学历要求</label>
            <select class="form-select" v-model="form.education">
              <option value="不限">不限</option>
              <option value="大专">大专</option>
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">职位描述</label>
          <textarea 
            class="form-textarea" 
            v-model="form.description" 
            rows="4"
            placeholder="请描述职位的主要职责..."
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">任职要求</label>
          <textarea 
            class="form-textarea" 
            v-model="form.requirements" 
            rows="4"
            placeholder="请列出任职要求，每条一行..."
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">福利待遇</label>
          <textarea 
            class="form-textarea" 
            v-model="form.benefits" 
            rows="3"
            placeholder="请描述公司提供的福利待遇..."
          ></textarea>
        </div>

        <div v-if="isEdit" class="form-group">
          <label class="form-label">职位状态</label>
          <select class="form-select" v-model="form.status">
            <option value="open">招聘中</option>
            <option value="closed">已关闭</option>
          </select>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
          <button type="button" class="btn btn-secondary" @click="goBack">取消</button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? '保存中...' : (isEdit ? '保存修改' : '发布职位') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { jobApi } from '../utils/api'

export default {
  name: 'JobForm',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const isEdit = computed(() => !!route.params.id)
    const submitting = ref(false)
    const error = ref('')
    const success = ref(false)

    const form = reactive({
      title: '',
      company: '',
      city: '',
      salary: '',
      experience: '不限',
      education: '不限',
      status: 'open',
      description: '',
      requirements: '',
      benefits: ''
    })

    const fetchJob = async () => {
      try {
        const data = await jobApi.getDetail(route.params.id)
        Object.assign(form, data)
      } catch (err) {
        error.value = err.error || '获取职位信息失败'
      }
    }

    const handleSubmit = async () => {
      if (!form.title || !form.company || !form.city || !form.salary) {
        error.value = '请填写所有必填项'
        return
      }

      submitting.value = true
      error.value = ''
      success.value = false

      try {
        if (isEdit.value) {
          await jobApi.update(route.params.id, form)
        } else {
          const result = await jobApi.create(form)
          router.replace(`/job/${result.id}`)
          return
        }
        success.value = true
        setTimeout(() => {
          router.push(`/job/${route.params.id}`)
        }, 1000)
      } catch (err) {
        error.value = err.error || '保存失败，请重试'
      } finally {
        submitting.value = false
      }
    }

    const goBack = () => {
      if (isEdit.value) {
        router.push(`/job/${route.params.id}`)
      } else {
        router.push('/')
      }
    }

    onMounted(() => {
      if (isEdit.value) {
        fetchJob()
      }
    })

    return {
      isEdit,
      form,
      submitting,
      error,
      success,
      handleSubmit,
      goBack
    }
  }
}
</script>
