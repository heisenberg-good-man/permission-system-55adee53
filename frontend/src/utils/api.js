import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error.response?.data || { error: '请求失败' })
  }
)

export const jobApi = {
  getList: (params) => api.get('/jobs', { params }),
  getDetail: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  updateStatus: (id, status) => api.patch(`/jobs/${id}/status`, { status }),
  remove: (id) => api.delete(`/jobs/${id}`),
  getStats: () => api.get('/jobs/stats/summary')
}

export const applicationApi = {
  getList: (params) => api.get('/applications', { params }),
  getDetail: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status })
}

export const messageApi = {
  getByApplication: (applicationId) => api.get(`/messages/application/${applicationId}`),
  create: (data) => api.post('/messages', data)
}

export default api
