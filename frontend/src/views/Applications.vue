<template>
  <div class="applications-page">
    <div class="page-header">
      <h1 class="page-title">
        {{ currentRole === 'recruiter' ? '投递管理' : '我的投递' }}
      </h1>
    </div>

    <div class="card">
      <div class="tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeTab === tab.value }"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" style="margin-left: 4px; color: #a0aec0;">
            ({{ tab.count }})
          </span>
        </div>
      </div>

      <div v-if="loading" class="loading">加载中...</div>

      <div v-else-if="filteredApplications.length === 0" class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">暂无{{ activeTabLabel }}记录</div>
      </div>

      <div v-else>
        <div 
          v-for="app in filteredApplications" 
          :key="app.id" 
          class="application-item"
        >
          <div class="application-header">
            <div>
              <div class="applicant-name">
                {{ currentRole === 'recruiter' ? app.applicantName : app.jobTitle }}
              </div>
              <div class="application-job">
                {{ currentRole === 'recruiter' ? app.jobTitle : app.applicantName }}
              </div>
            </div>
            <span class="status-badge" :class="'status-' + app.status">
              {{ statusLabels[app.status] }}
            </span>
          </div>

          <div class="application-info">
            <span>📧 {{ app.email }}</span>
            <span>📱 {{ app.phone }}</span>
            <span>💼 {{ app.experience }}</span>
            <span>🎓 {{ app.education }}</span>
            <span>⏰ {{ app.appliedAt }}</span>
          </div>

          <div style="background: #f7fafc; padding: 12px; border-radius: 6px; margin-top: 8px;">
            <div style="font-weight: 500; margin-bottom: 4px; color: #4a5568;">简历介绍：</div>
            <div style="color: #718096; font-size: 14px; line-height: 1.6;">{{ app.resume }}</div>
          </div>

          <div v-if="currentRole === 'recruiter'" class="application-actions">
            <select 
              class="form-select" 
              v-model="statusUpdates[app.id]" 
              style="width: 140px; padding: 6px 10px;"
            >
              <option value="">更新状态</option>
              <option value="reviewing">简历筛选中</option>
              <option value="interview">安排面试</option>
              <option value="offer">已发Offer</option>
              <option value="rejected">已拒绝</option>
            </select>
            <button 
              class="btn btn-primary" 
              :disabled="!statusUpdates[app.id]"
              @click="updateStatus(app)"
            >
              确认更新
            </button>
            <button class="btn btn-secondary" @click="toggleMessagePanel(app.id)">
              {{ expandedMessageId === app.id ? '收起沟通' : '查看沟通' }}
            </button>
          </div>

          <div v-if="expandedMessageId === app.id" class="message-panel">
            <div style="font-weight: 500; margin-bottom: 12px; color: #4a5568;">沟通记录</div>
            <div class="message-list">
              <div v-if="messagesLoading" style="text-align: center; color: #a0aec0; padding: 20px;">
                加载中...
              </div>
              <div v-else-if="messagesByApp[app.id]?.length === 0" style="text-align: center; color: #a0aec0; padding: 20px;">
                暂无沟通记录
              </div>
              <div 
                v-for="msg in messagesByApp[app.id]" 
                :key="msg.id"
                class="message-item"
                :class="msg.sender"
              >
                <div>{{ msg.content }}</div>
                <div class="message-time">{{ msg.time }}</div>
              </div>
            </div>
            <div class="message-input-area">
              <input 
                type="text" 
                class="form-input" 
                v-model="newMessages[app.id]" 
                placeholder="输入消息..."
                @keyup.enter="sendMessage(app.id)"
              />
              <button 
                class="btn btn-primary" 
                :disabled="!newMessages[app.id]?.trim()"
                @click="sendMessage(app.id)"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, inject, onMounted, watch } from 'vue'
import { applicationApi, messageApi } from '../utils/api'

export default {
  name: 'Applications',
  setup() {
    const currentRole = inject('currentRole')

    const applications = ref([])
    const loading = ref(false)
    const activeTab = ref('all')
    const expandedMessageId = ref(null)
    const messagesByApp = reactive({})
    const messagesLoading = ref(false)
    const statusUpdates = reactive({})
    const newMessages = reactive({})

    const statusLabels = {
      pending: '待处理',
      reviewing: '筛选中',
      interview: '面试中',
      offer: '已发Offer',
      rejected: '已拒绝'
    }

    const tabs = computed(() => [
      { label: '全部', value: 'all' },
      { label: '待处理', value: 'pending' },
      { label: '筛选中', value: 'reviewing' },
      { label: '面试中', value: 'interview' },
      { label: '已拒绝', value: 'rejected' }
    ])

    const activeTabLabel = computed(() => {
      const tab = tabs.value.find(t => t.value === activeTab.value)
      return tab ? tab.label : ''
    })

    const filteredApplications = computed(() => {
      if (activeTab.value === 'all') return applications.value
      return applications.value.filter(a => a.status === activeTab.value)
    })

    const fetchApplications = async () => {
      loading.value = true
      try {
        const data = await applicationApi.getList()
        applications.value = data
      } catch (err) {
        console.error('获取投递列表失败:', err)
      } finally {
        loading.value = false
      }
    }

    const switchTab = (tab) => {
      activeTab.value = tab
    }

    const updateStatus = async (app) => {
      const newStatus = statusUpdates[app.id]
      if (!newStatus) return

      try {
        await applicationApi.updateStatus(app.id, newStatus)
        app.status = newStatus
        statusUpdates[app.id] = ''
      } catch (err) {
        console.error('更新状态失败:', err)
      }
    }

    const toggleMessagePanel = async (appId) => {
      if (expandedMessageId.value === appId) {
        expandedMessageId.value = null
        return
      }

      expandedMessageId.value = appId
      if (!messagesByApp[appId]) {
        await loadMessages(appId)
      }
    }

    const loadMessages = async (appId) => {
      messagesLoading.value = true
      try {
        const data = await messageApi.getByApplication(appId)
        messagesByApp[appId] = data
      } catch (err) {
        console.error('获取消息失败:', err)
        messagesByApp[appId] = []
      } finally {
        messagesLoading.value = false
      }
    }

    const sendMessage = async (appId) => {
      const content = newMessages[appId]?.trim()
      if (!content) return

      try {
        const msg = await messageApi.create({
          applicationId: appId,
          sender: 'recruiter',
          content
        })

        if (!messagesByApp[appId]) {
          messagesByApp[appId] = []
        }
        messagesByApp[appId].push(msg)
        newMessages[appId] = ''
      } catch (err) {
        console.error('发送消息失败:', err)
      }
    }

    onMounted(() => {
      fetchApplications()
    })

    return {
      currentRole,
      applications,
      loading,
      activeTab,
      tabs,
      activeTabLabel,
      filteredApplications,
      statusLabels,
      expandedMessageId,
      messagesByApp,
      messagesLoading,
      statusUpdates,
      newMessages,
      switchTab,
      updateStatus,
      toggleMessagePanel,
      sendMessage
    }
  }
}
</script>
