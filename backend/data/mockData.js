let jobs = [
  {
    id: 1,
    title: '高级前端工程师',
    company: '科技有限公司',
    city: '北京',
    salary: '25k-40k',
    experience: '3-5年',
    education: '本科',
    status: 'open',
    description: '负责公司核心产品的前端开发工作，参与技术架构设计与优化。',
    requirements: '1. 3年以上前端开发经验；\n2. 精通 Vue/React 等主流框架；\n3. 熟悉前端工程化和性能优化；\n4. 良好的沟通能力和团队协作精神。',
    benefits: '五险一金、年终奖、带薪年假、定期团建',
    createdAt: '2024-01-15',
    views: 328
  },
  {
    id: 2,
    title: '后端开发工程师',
    company: '数据科技公司',
    city: '上海',
    salary: '20k-35k',
    experience: '1-3年',
    education: '本科',
    status: 'open',
    description: '负责公司后端服务的设计与开发，保障系统稳定性。',
    requirements: '1. 1年以上后端开发经验；\n2. 熟悉 Node.js/Python/Java 至少一种；\n3. 了解 MySQL/MongoDB 数据库；\n4. 有良好的编码习惯。',
    benefits: '弹性工作、下午茶、股票期权',
    createdAt: '2024-01-20',
    views: 256
  },
  {
    id: 3,
    title: '产品经理',
    company: '互联网公司',
    city: '深圳',
    salary: '18k-30k',
    experience: '3-5年',
    education: '本科',
    status: 'open',
    description: '负责产品规划、需求分析和产品迭代。',
    requirements: '1. 3年以上产品经理经验；\n2. 有互联网产品经验优先；\n3. 良好的逻辑思维和沟通能力；\n4. 熟练使用 Axure、Figma 等工具。',
    benefits: '五险一金、节日福利、健身房',
    createdAt: '2024-02-01',
    views: 189
  },
  {
    id: 4,
    title: 'UI/UX设计师',
    company: '设计工作室',
    city: '杭州',
    salary: '12k-20k',
    experience: '1-3年',
    education: '本科',
    status: 'closed',
    description: '负责产品界面设计和用户体验优化。',
    requirements: '1. 1年以上 UI 设计经验；\n2. 熟练使用 Figma/Sketch；\n3. 有完整的作品集；\n4. 对用户体验有深入理解。',
    benefits: '创意氛围、扁平管理、年终奖',
    createdAt: '2024-01-10',
    views: 145
  },
  {
    id: 5,
    title: '测试工程师',
    company: '软件公司',
    city: '广州',
    salary: '10k-18k',
    experience: '1-3年',
    education: '大专',
    status: 'open',
    description: '负责软件测试工作，保障产品质量。',
    requirements: '1. 1年以上测试经验；\n2. 熟悉测试流程和方法；\n3. 会使用自动化测试工具优先；\n4. 细心、有责任心。',
    benefits: '五险一金、双休、节日福利',
    createdAt: '2024-02-10',
    views: 98
  }
];

let applications = [
  {
    id: 1,
    jobId: 1,
    jobTitle: '高级前端工程师',
    applicantName: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    experience: '4年',
    education: '本科',
    resume: '有4年前端开发经验，精通Vue和React，主导过3个大型项目...',
    status: 'pending',
    appliedAt: '2024-02-15 10:30'
  },
  {
    id: 2,
    jobId: 1,
    jobTitle: '高级前端工程师',
    applicantName: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    experience: '3年',
    education: '硕士',
    resume: '3年前端开发经验，熟悉Vue生态，有组件库开发经验...',
    status: 'interview',
    appliedAt: '2024-02-16 14:20'
  },
  {
    id: 3,
    jobId: 2,
    jobTitle: '后端开发工程师',
    applicantName: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    experience: '2年',
    education: '本科',
    resume: '2年后端开发经验，熟悉Node.js和MongoDB...',
    status: 'rejected',
    appliedAt: '2024-02-12 09:15'
  }
];

let messages = [
  {
    id: 1,
    applicationId: 2,
    sender: 'recruiter',
    content: '您好，我们对您的简历很感兴趣，方便来面试吗？',
    time: '2024-02-17 10:00'
  },
  {
    id: 2,
    applicationId: 2,
    sender: 'applicant',
    content: '好的，请问面试时间是什么时候？',
    time: '2024-02-17 10:30'
  },
  {
    id: 3,
    applicationId: 2,
    sender: 'recruiter',
    content: '下周三下午2点可以吗？地点在我们公司会议室。',
    time: '2024-02-17 11:00'
  }
];

let nextJobId = 6;
let nextApplicationId = 4;
let nextMessageId = 4;

module.exports = {
  jobs,
  applications,
  messages,
  nextJobId,
  nextApplicationId,
  nextMessageId
};
