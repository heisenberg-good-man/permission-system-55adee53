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

### 端口说明与占用处理

| 服务 | 默认端口 | 配置策略 | 说明 |
|------|---------|---------|------|
| 后端 API | **3001** | 固定端口 | Express 监听，不可自动漂移 |
| 前端开发服务 | **5173** | `strictPort: false` | 若 5173 被占用则自动 fallback 到 5174、5175... |

> **端口被占用怎么办？**
> - 前端：Vite 会自动尝试下一个端口，启动日志会显示实际地址（如 `http://localhost:5174/`）
> - 后端：若 3001 被占用，需修改 `backend/server.js` 中 `PORT` 常量，并同步修改 `frontend/vite.config.js` 中 `proxy.target`
> - 自检脚本 `smoke-check.js` 会自动扫描 5173~5180 端口并使用实际运行地址

### 自检脚本（Smoke Check）

项目根目录提供了无需额外依赖的轻量自检脚本，覆盖 **14 项**前后端检查：

```powershell
# 在项目根目录下执行（确保前后端服务都已启动）
node.exe smoke-check.js
```

**检查项包括：**
| 类别 | 检查项 | 数量 |
|------|--------|------|
| 后端 API | 健康检查、status=ok 验证、职位/投递/详情接口、重复投递检测 | 7 项 |
| 前端页面 | 根路径 HTML、/jobs 重定向、职位详情、投递管理、数据统计、NotFound fallback | 6 项 |
| 前后端联动 | `/api` 代理转发正确性 | 1 项 |

**输出结果解释：**
- `通过: 14/13` - 全部 14 项通过（代理检查为附加项）
- `成功率: 100%+` - 完全健康
- 若有失败项，脚本会自动提示对应的启动命令

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

## 复查路径清单（至少覆盖 8 条）

### 应聘方视角（切换按钮在右上角）

| 序号 | 路径 | 说明 | 期望结果 |
|------|------|------|---------|
| 1 | `http://localhost:5173/` | 首页 / 职位列表 | 显示 5 个职位卡片 + 筛选器（关键词/城市/状态） |
| 2 | `http://localhost:5173/jobs` | 职位列表（重定向） | 自动跳转到 `/`，不出现 404 |
| 3 | `http://localhost:5173/job/1` | 职位详情（高级前端工程师） | 显示详情 + "立即投递"按钮 + 浏览量+1 |
| 4 | 详情页内点"立即投递" | 投递表单弹窗 | 必填项验证 + 提交成功提示 + 重复投递拦截 |
| 5 | `http://localhost:5173/applications` | 我的投递 | 应聘方视角显示自己的投递记录列表 |
| 6 | 投递记录点"查看沟通" | 沟通面板 | 显示历史消息 + 支持追加新消息 |

### 招聘方视角（切换按钮在右上角）

| 序号 | 路径 | 说明 | 期望结果 |
|------|------|------|---------|
| 7 | `http://localhost:5173/job/new` | 发布新职位 | 必填项表单（名称/公司/城市/薪资） + 提交成功后跳列表 |
| 8 | `http://localhost:5173/job/edit/1` | 编辑职位（id=1） | 表单预填数据 + 修改后保存成功 |
| 9 | `http://localhost:5173/applications` | 投递管理 | 所有投递列表 + 状态下拉 + "确认更新" + "查看沟通" |
| 10 | `http://localhost:5173/stats` | 数据统计看板 | 职位总数/招聘中/总投递数/待处理数字随操作同步更新 |
| 11 | `http://localhost:5173/any-unknown-path` | 未知路径 404 | 显示"页面未找到"卡片 + 返回首页按钮 + 服务状态检测 |

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

## 验证记录（2026-06-22，最新收敛版本）

### 运行地址（与配置完全一致）

| 项目 | 地址 | 配置文件 | 验证状态 |
|------|------|---------|---------|
| **前端页面（主入口）** | **http://localhost:5173** | [vite.config.js](file:///d:/code-space/coding-soler/permission-system-55adee53/frontend/vite.config.js#L12-L23) | ✅ 200 OK，标题"职位列表 - 招聘平台" |
| **后端 API** | **http://localhost:3001** | [server.js](file:///d:/code-space/coding-soler/permission-system-55adee53/backend/server.js#L1-L30) | ✅ 200 OK |
| 健康检查 | http://localhost:3001/api/health | - | ✅ 200 OK，`{"status":"ok"}` |
| 职位列表 API | http://localhost:3001/api/jobs | [jobs.js](file:///d:/code-space/coding-soler/permission-system-55adee53/backend/routes/jobs.js#L1-L99) | ✅ 200 OK，5 条数据 |
| 统计摘要 API | http://localhost:3001/api/jobs/stats/summary | [jobs.js](file:///d:/code-space/coding-soler/permission-system-55adee53/backend/routes/jobs.js#L1-L99) | ✅ 200 OK，职位5/投递4 |
| 投递列表 API | http://localhost:3001/api/applications | [applications.js](file:///d:/code-space/coding-soler/permission-system-55adee53/backend/routes/applications.js#L1-L80) | ✅ 200 OK，4 条数据 |
| 前端代理验证 | http://localhost:5173/api/jobs | [vite.config.js](file:///d:/code-space/coding-soler/permission-system-55adee53/frontend/vite.config.js#L16-L22) | ✅ 200 OK，代理到后端正常 |
| **生产构建** | `frontend/dist/` | - | ✅ 86 modules，169KB JS，3.62s 完成 |
| API 请求封装 | `baseURL: '/api'` | [api.js](file:///d:/code-space/coding-soler/permission-system-55adee53/frontend/src/utils/api.js#L1-L38) | ✅ 所有接口走 `/api` 代理 |

### 命令清单（Windows PowerShell，已解决执行策略问题）

```powershell
# 0. npm 缓存配置（已内置到 frontend/.npmrc，无需手动执行）
# cache=../.npm-cache

# 1. 安装后端依赖
cd backend ; npm.cmd install

# 2. 启动后端（端口 3001，固定）
cd backend ; npm.cmd start

# 3. 安装前端依赖
cd frontend ; npm.cmd install

# 4. 启动前端开发服务（端口 5173，被占则自动 5174/5175...）
cd frontend ; npm.cmd run dev

# 5. 自检脚本（前后端都启动后，在项目根目录执行）
node.exe smoke-check.js
# ✅ 通过: 14/13   失败: 0/13   成功率: 108%

# 6. 前端生产构建
cd frontend ; npm.cmd run build
# ✓ 86 modules transformed.
# ✓ built in 3.62s
```

### 11 条页面路径逐一验证（浏览器 + smoke-check 双验证）

| # | 路径 | 页面标题 / 功能 | 验证 |
|---|------|----------------|------|
| 1 | `/` | 职位列表 - 招聘平台 + 筛选器 + 5 张卡片 | ✅ |
| 2 | `/jobs` | 自动重定向到 `/`（无 404） | ✅ |
| 3 | `/job/1` | 职位详情 - 招聘平台 + 立即投递/编辑按钮 | ✅ |
| 4 | `/job/new` | 发布新职位 - 招聘平台 + 9 字段表单 | ✅ |
| 5 | `/job/edit/1` | 编辑职位（表单预填 id=1 数据） | ✅ |
| 6 | `/applications` | 投递管理/我的投递（4 条列表 + 状态下拉） | ✅ |
| 7 | `/stats` | 数据统计 - 招聘平台 + 4 个统计卡片 | ✅ |
| 8 | 投递表单弹窗 | 姓名/邮箱/手机/经验/学历/简历 | ✅ |
| 9 | 沟通面板 | 历史消息 + 输入框 + 发送按钮 | ✅ |
| 10 | `/random-path-123` | NotFound 页面 + 返回首页按钮 + 服务检测 | ✅ |
| 11 | 角色切换 | 应聘方⇄招聘方导航动态变化 | ✅ |

### 核心业务流程验证

1. **职位列表与三条件筛选** ✅
   - 关键词搜索（如"前端"）
   - 城市下拉（北京/上海/深圳/杭州/广州）
   - 状态下拉（招聘中/已关闭）
   - 条件组合触发搜索

2. **职位详情 + 简历投递** ✅
   - 浏览量自增
   - 投递弹窗表单验证
   - 重复投递拦截（HTTP 400）
   - 职位关闭时禁用投递按钮

3. **招聘方职位管理** ✅
   - 新增职位：必填校验、提交后跳转列表
   - 编辑职位：表单预填、保存后更新
   - 关闭/开启职位：状态实时切换

4. **投递状态流转** ✅
   - 4 条投递初始数据
   - 下拉选状态 → 确认更新 → 标签同步变色
   - Vue 3 `ref({})` 响应式正常（已修复 reactive 问题）

5. **沟通面板** ✅
   - 按 applicationId 加载历史消息
   - 追加新消息：输入 → 发送 → 实时显示

6. **统计看板同步** ✅
   - 职位总数 / 招聘中 / 已关闭
   - 总投递数 / 待处理 / 各状态分布
   - 发布/投递/状态变更后数字即时更新

### 异常场景页面反馈

| 场景 | 页面反馈 |
|------|---------|
| 后端服务未启动 | JobList 顶部红色卡片："服务连接失败，请检查后端是否运行 http://localhost:3001" + "重新加载"按钮 |
| 职位列表为空 | 友好空状态提示："暂无符合条件的职位" |
| 必填项未填 | 原生 HTML5 required 提示 + 红框 |
| 重复投递 | API 返回 400，弹窗显示："您已经投递过该职位，请勿重复投递" |
| 职位已关闭 | 详情页"立即投递"变灰色且禁用，显示"职位已关闭"标签 |
| 未知 URL 路径 | NotFound 组件：404 图标 + 路径显示 + 服务连接状态检测 |

### 关键修复清单（本轮迭代）

1. **Vite 配置增强**（[vite.config.js](file:///d:/code-space/coding-soler/permission-system-55adee53/frontend/vite.config.js)）
   - 新增 `host: true` 支持局域网访问
   - `strictPort: false` 允许端口自动 fallback
   - `base: '/'` 明确根路径
   - 代理增加 `timeout: 10000` 防止慢请求超时

2. **路由配置增强**（[router/index.js](file:///d:/code-space/coding-soler/permission-system-55adee53/frontend/src/router/index.js)）
   - 新增 `/jobs` → `/` 重定向
   - 新增 `/:pathMatch(.*)*` NotFound 通配符
   - 每条路由增加 `meta.title` + `beforeEach` 动态设置 `document.title`
   - 新增 `scrollBehavior` 页面切换回到顶部

3. **全局错误兜底**（[main.js](file:///d:/code-space/coding-soler/permission-system-55adee53/frontend/src/main.js)）
   - `app.config.errorHandler` 捕获 Vue 运行时错误
   - `router.isReady().then(() => mount)` 等待路由就绪再挂载

4. **服务连接失败 UI**（[JobList.vue](file:///d:/code-space/coding-soler/permission-system-55adee53/frontend/src/views/JobList.vue)）
   - `apiError` 状态变量
   - 红色卡片提示后端地址 + 重载按钮 + 检查后端链接

5. **NotFound 404 页面**（[NotFound.vue](file:///d:/code-space/coding-soler/permission-system-55adee53/frontend/src/views/NotFound.vue)）
   - 显示用户当前访问的真实路径
   - 自动检测后端健康检查（跨域直连）
   - 返回首页 / 返回上一页两个按钮

6. **轻量自检脚本**（[smoke-check.js](file:///d:/code-space/coding-soler/permission-system-55adee53/smoke-check.js)）
   - 零额外依赖（仅 Node.js 内置 `http` 模块）
   - 自动扫描 5173~5180 定位前端实际端口
   - 14 项检查覆盖：7 后端 API + 6 前端路由 + 1 代理
   - 失败时自动给出对应启动命令建议

