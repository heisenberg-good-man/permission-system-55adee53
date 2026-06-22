<template>
  <div id="app">
    <header class="header">
      <div class="container header-content">
        <div class="logo" @click="goHome">招聘平台</div>
        <nav class="nav">
          <router-link to="/">职位列表</router-link>
          <template v-if="currentRole === 'recruiter'">
            <router-link to="/applications">投递管理</router-link>
            <router-link to="/stats">数据统计</router-link>
            <router-link to="/job/new">发布职位</router-link>
          </template>
          <template v-else>
            <router-link to="/applications">我的投递</router-link>
          </template>
          <div class="role-switch">
            <button 
              class="role-btn" 
              :class="{ active: currentRole === 'applicant' }"
              @click="switchRole('applicant')"
            >
              应聘方
            </button>
            <button 
              class="role-btn" 
              :class="{ active: currentRole === 'recruiter' }"
              @click="switchRole('recruiter')"
            >
              招聘方
            </button>
          </div>
        </nav>
      </div>
    </header>
    <main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import { ref, provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const currentRole = ref('applicant')

    const switchRole = (role) => {
      currentRole.value = role
      localStorage.setItem('userRole', role)
      if (role === 'applicant') {
        router.push('/')
      } else {
        router.push('/applications')
      }
    }

    const goHome = () => {
      router.push('/')
    }

    onMounted(() => {
      const savedRole = localStorage.getItem('userRole')
      if (savedRole) {
        currentRole.value = savedRole
      }
    })

    provide('currentRole', currentRole)

    return {
      currentRole,
      switchRole,
      goHome
    }
  }
}
</script>
