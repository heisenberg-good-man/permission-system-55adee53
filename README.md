# 招聘平台首版原型

前后端分离的招聘平台原型，聚焦"招聘方发布职位、应聘方投简历、双方建立沟通入口"主流程。

## 技术栈

- **前端**：Vue 3 + Vue Router + Axios + Vite
- **后端**：Node.js + Express.js
- **数据**：内存 Mock 数据
- **架构**：前后端分离，前端通过代理连接后端 API

## 项目结构

```
.
├── backend/                 # 后端服务
│   ├── data/
│   │   └── mockData.js     # Mock 数据层
│   ├── routes/
│   │   ├── jobs.js         # 职位相关 API
│   │   ├── applications.js # 投递相关 API
│   │   └── messages.js     # 消息沟通 API
│   ├── server.js            # Express 服务器入口
│   └── package.json
├── frontend/                # 前端应用
│   ├── src/
│   │   ├── views/           # 页面组件
│   │   │   ├── JobList.vue      # 职位列表
│   │   │   ├── JobDetail.vue    # 职位详情
│   │   │   ├── JobForm.vue      # 职位发布/编辑
│   │   │   ├── Applications.vue # 投递管理
│   │   │   └── Stats.vue        # 数据统计
│   │   ├── router/          # 路由配置
│   │   ├── utils/           # 工具函数
│   │   │   └── api.js       # API 封装
│   │   ├── assets/
│   │   │   └── styles.css    # 全局样式
│   │   ├── App.vue          # 根组件
│   │   └── main.js          # 入口文件
│   ├── vite.config.js       # Vite 配置
│   └── package.json
├── .npm-cache/              # npm 本地缓存目录
└── README.md
```

## 功能特性

### 业务模块

1. **职位列表与详情**
   - 按岗位名称/城市/状态筛选
   - 职位卡片展示
   - 点击进入详情页

2. **简历投递**
   - 填写并提交简历表单
   - 必填项验证
   - 重复投递检测
   - 职位已关闭提示

3. **招聘方职位管理**
   - 发布新职位
   - 编辑现有职位
   - 开启/关闭职位
   - 必填项验证

4. **投递记录与沟通面板**
   - 投递记录列表
   - 状态筛选（待处理/筛选中/面试中/已拒绝/已录用）
   - 更新处理状态
   - 消息沟通面板
   - 追加沟通消息

5. **数据统计**
   - 职位总数、招聘中数量
   - 总投递数、待处理数
   - 职位状态分布
   - 投递处理进度

6. **双视角切换**
   - 应聘方视角
   - 招聘方视角

### 异常反馈

- 空列表提示
- 必填项缺失提示
- 重复投递提示
- 职位已关闭提示
- 操作成功/失败反馈

## API 接口

### 职位接口 (Jobs)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/jobs | 获取职位列表（支持 keyword、city、status 筛选） |
| GET | /api/jobs/:id | 获取职位详情（浏览量+1） |
| POST | /api/jobs | 创建新职位 |
| PUT | /api/jobs/:id | 更新职位 |
| PATCH | /api/jobs/:id/status | 更新职位状态（open/closed） |
| DELETE | /api/jobs/:id | 删除职位 |
| GET | /api/jobs/stats/summary | 获取统计摘要 |

### 投递接口 (Applications)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/applications | 获取投递列表（支持 jobId、status 筛选） |
| GET | /api/applications/:id | 获取投递详情 |
| POST | /api/applications | 创建投递（检查职位状态、重复投递） |
| PATCH | /api/applications/:id/status | 更新投递状态 |

### 消息接口 (Messages)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/messages/application/:applicationId | 获取某投递的所有消息 |
| POST | /api/messages | 发送新消息 |

## 快速开始

### 环境要求

- Node.js >= 14+
- npm 或 pnpm

### Windows PowerShell 环境说明

> 注意：Windows PowerShell 下建议使用 `npm.cmd`、`npx.cmd` 等命令，避免 `npm.ps1` 执行策略问题。
> 本项目已配置 npm 缓存到项目根目录的 `.npm-cache` 文件夹，避免全局缓存权限问题。

### 安装依赖

#### 后端

```powershell
# 进入后端目录
cd backend

# 安装依赖（使用 npm.cmd 避免 PowerShell 执行策略问题）
npm.cmd install
```

#### 前端

```powershell
# 进入前端目录
cd frontend

# 安装依赖
npm.cmd install
```

### 启动服务

#### 启动后端

```powershell
# 在 backend 目录下
npm.cmd start
```

后端服务运行在 http://localhost:3001

#### 启动前端开发服务器

```powershell
# 在 frontend 目录下
npm.cmd run dev
```

前端开发服务器运行在 http://localhost:5173

前端已配置 `/api` 代理到后端 `http://localhost:3001`

### 构建生产版本

```powershell
# 在 frontend 目录下
npm.cmd run build
```

构建产物输出到 `frontend/dist` 目录

## 本地访问地址

- **前端页面**: http://localhost:5173
- **后端 API**: http://localhost:3001
- **健康检查**: http://localhost:3001/api/health

## 复查路径

### 应聘方流程

1. 打开首页 http://localhost:5173 → 查看职位列表
2. 使用搜索框按关键词/城市/状态筛选职位
3. 点击职位卡片 → 进入职位详情页
4. 点击"立即投递" → 填写简历表单 → 提交
5. 切换到"我的投递"查看投递记录

### 招聘方流程

1. 点击右上角"切换为招聘方"
2. 点击"发布职位" → 填写职位信息 → 提交
3. 在职位列表中点击"编辑"修改职位信息
4. 进入"投递管理"查看所有投递
5. 点击某条投递 → 更新状态、查看沟通 → 发送消息

### 数据联动验证

1. 发布新职位 → 职位列表立即显示新职位
2. 投递简历 → 职位详情投递数+1、统计数字更新
3. 更新投递状态 → 列表状态同步更新
4. 发送消息 → 沟通面板实时显示

## 初始 Mock 数据

- 5 个初始职位（前端开发、产品经理、UI设计师、后端开发、测试工程师）
- 3 条初始投递记录
- 3 条初始沟通消息

> 注意：数据存储在内存中，重启后端服务后数据会重置。

## 开发说明

### 前端代理配置

前端通过 Vite 配置了 `/api` 代理，开发时无需处理跨域问题：

```js
// vite.config.js
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true
    }
  }
}
```

### 角色切换

通过顶部导航栏的角色切换按钮，在应聘方/招聘方视角之间切换。
当前角色通过 Vue 的 provide/inject 传递给子组件。

### 状态标签

- `open` / 招聘中 - 绿色
- `closed` / 已关闭 - 灰色
- `pending` / 待处理 - 橙色
- `screening` / 筛选中 - 蓝色
- `interview` / 面试中 - 紫色
- `rejected` / 已拒绝 - 红色
- `hired` / 已录用 - 绿色

## License

MIT

---

## 验证记录（2026-06-22）

### 访问地址验证

| 项目 | 地址 | 状态 |
|------|------|------|
| 前端页面 | http://localhost:5173 | ✅ 200 OK，完整渲染 |
| 后端健康检查 | http://localhost:3001/api/health | ✅ 200 OK |
| 职位列表 API | http://localhost:3001/api/jobs | ✅ 200 OK，5 条数据 |
| 统计数据 API | http://localhost:3001/api/jobs/stats/summary | ✅ 200 OK |
| 投递列表 API | http://localhost:3001/api/applications | ✅ 200 OK，4 条数据 |
| API 代理 | http://localhost:5173/api/jobs | ✅ 200 OK，代理正常 |

### 命令验证

```powershell
# 安装依赖（使用 npm.cmd 避免 PowerShell 执行策略）
npm.cmd install --cache .\.npm-cache

# 启动后端
cd backend ; npm.cmd start

# 启动前端
cd frontend ; npm.cmd run dev

# 前端构建
cd frontend ; npm.cmd run build
# ✓ 85 modules transformed.
# ✓ built in 3.51s
# 产物: dist/index.html, dist/assets/index-*.js, dist/assets/index-*.css
```

### 核心业务流程验证

1. **职位列表与筛选** ✅
   - 访问 http://localhost:5173/ 显示 5 个职位卡片
   - 按关键词筛选（"前端" → 1 条结果）
   - 按城市筛选（"北京" → 1 条结果）
   - 按状态筛选（"招聘中" → 4 条结果）
   - 组合筛选（"北京 + 招聘中" → 1 条结果）

2. **职位详情与投递** ✅
   - 点击职位卡片进入 http://localhost:5173/job/5
   - 点击"立即投递"打开表单弹窗
   - 填写姓名/邮箱/手机号/简历后提交
   - 显示"投递成功"和"查看我的投递"按钮
   - 统计数据实时更新（总投递数 3 → 4）

3. **投递记录查看** ✅
   - 访问 http://localhost:5173/applications
   - 显示 4 条投递记录（含新增的赵六投递）
   - 标签筛选（全部/待处理/筛选中/面试中/已拒绝）

4. **招聘方角色** ✅
   - 点击"招聘方"切换视角
   - 导航变为：职位列表 / 投递管理 / 数据统计 / 发布职位
   - 投递管理页显示所有投递，支持状态更新和消息沟通

5. **投递状态更新** ✅
   - 选择"安排面试"状态
   - 点击"确认更新"
   - 赵六状态从"待处理"→"面试中"实时更新

6. **沟通消息** ✅
   - 点击"查看沟通"展开消息面板
   - 输入消息并发送
   - 消息实时显示在沟通面板中

7. **数据统计** ✅
   - 访问 http://localhost:5173/stats
   - 职位总数: 5
   - 招聘中职位: 4
   - 总投递数: 4
   - 待处理投递: 1

### 异常场景验证

- **重复投递** ✅ 返回 400 错误："您已经投递过该职位，请勿重复投递"
- **必填项缺失** ✅ 表单提交时显示验证提示
- **API 未连通** ✅ 页面显示空状态和友好提示
- **职位已关闭** ✅ 无法投递，显示"职位已关闭"提示

### 关键修复记录

1. **后端路由顺序 Bug**（jobs.js）
   - 问题：`/stats/summary` 定义在 `/:id` 之后，导致被当作 ID 参数
   - 修复：将 `/stats/summary` 移到 `/:id` 之前定义
   - 文件：[jobs.js](file:///d:/code-space/coding-soler/permission-system-55adee53/backend/routes/jobs.js#L1-L99)

2. **Vue 3 响应式 Bug**（Applications.vue）
   - 问题：`reactive({})` 上动态添加属性时响应式失效，状态选择后按钮仍为 disabled
   - 修复：改用 `ref({})` + getter/setter 方法，通过替换整个对象触发响应式
   - 文件：[Applications.vue](file:///d:/code-space/coding-soler/permission-system-55adee53/frontend/src/views/Applications.vue#L1-L290)

3. **npm 缓存配置**（.npmrc）
   - 配置：`cache=../.npm-cache` 避免全局缓存权限问题
   - 文件：[.npmrc](file:///d:/code-space/coding-soler/permission-system-55adee53/frontend/.npmrc)

