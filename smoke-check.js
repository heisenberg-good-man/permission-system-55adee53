const http = require('http');

const BACKEND_PORT = 3001;
const BACKEND_BASE = `http://localhost:${BACKEND_PORT}`;

const RESULTS = [];
let TOTAL = 0;
let passed = 0;
let failed = 0;
let FRONTEND_PORT = process.env.FRONTEND_PORT || null;
let FRONTEND_BASE = '';

async function detectFrontendPort() {
  if (FRONTEND_PORT) {
    FRONTEND_BASE = `http://localhost:${FRONTEND_PORT}`;
    const r = await httpRequest(`${FRONTEND_BASE}/`, 'GET', null, 5000, 'text/html');
    if (r.status === 200) return true;
  }
  for (let p = 5173; p <= 5180; p++) {
    FRONTEND_PORT = p;
    FRONTEND_BASE = `http://localhost:${p}`;
    const r = await httpRequest(`${FRONTEND_BASE}/api/health`, 'GET', null, 3000, 'application/json');
    if (r.status === 200) return true;
    const r2 = await httpRequest(`${FRONTEND_BASE}/`, 'GET', null, 3000, 'text/html');
    if (r2.status === 200) return true;
  }
  return false;
}

function httpRequest(url, method = 'GET', body = null, timeoutMs = 8000, accept = 'application/json') {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method,
        headers: { 'Accept': accept },
        timeout: timeoutMs
      };
      if (body) {
        const postData = JSON.stringify(body);
        options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          let parsed = data;
          try { parsed = JSON.parse(data); } catch (e) {}
          resolve({ status: res.statusCode, data: parsed, raw: data });
        });
      });
      req.on('error', (err) => {
        resolve({ status: 0, error: err.message, data: null });
      });
      req.on('timeout', () => {
        req.destroy();
        resolve({ status: 0, error: '请求超时', data: null });
      });
      if (body) req.write(JSON.stringify(body));
      req.end();
    } catch (err) {
      resolve({ status: 0, error: err.message, data: null });
    }
  });
}

function assert(condition, name, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✅ [${String(passed + failed).padStart(2)}/${TOTAL}] ${name}${detail ? ' - ' + detail : ''}`);
    RESULTS.push({ name, status: 'PASS', detail });
  } else {
    failed++;
    console.log(`  ❌ [${String(passed + failed).padStart(2)}/${TOTAL}] ${name}${detail ? ' - ' + detail : ''}`);
    RESULTS.push({ name, status: 'FAIL', detail });
  }
}

function divider(title = '') {
  const line = '─'.repeat(Math.max(0, 60 - title.length));
  console.log(`\n${title ? '─ ' + title + ' ' : ''}${line}`);
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║        招聘平台 自检脚本 (Smoke Check)                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n  后端: ${BACKEND_BASE}`);

  const feOk = await detectFrontendPort();
  if (feOk) {
    console.log(`  前端: ${FRONTEND_BASE} (自动检测)`);
  } else {
    FRONTEND_PORT = 5173;
    FRONTEND_BASE = `http://localhost:${FRONTEND_PORT}`;
    console.log(`  前端: ${FRONTEND_BASE} (⚠️  未检测到运行)`);
  }
  console.log(`  时间: ${new Date().toLocaleString('zh-CN')}`);

  TOTAL = 16;

  // ========== 1. 后端服务检查 ==========
  divider('后端 API 检查 (核心路径依赖项)');

  const health = await httpRequest(`${BACKEND_BASE}/api/health`);
  assert(health.status === 200, '后端健康检查', `HTTP ${health.status}`);
  if (health.status === 200) {
    assert(health.data?.status === 'ok', '健康检查返回 status=ok', JSON.stringify(health.data).substring(0, 60));
  } else {
    assert(false, '健康检查返回 status=ok', `后端未响应: ${health.error || 'HTTP ' + health.status}`);
  }

  // ========== 2. 后端业务接口 ==========
  divider('后端业务接口');

  const jobs = await httpRequest(`${BACKEND_BASE}/api/jobs`);
  assert(jobs.status === 200 && Array.isArray(jobs.data), 'GET /api/jobs 职位列表',
    jobs.status === 200 ? `${jobs.data?.length || 0} 条数据` : `HTTP ${jobs.status}`);

  const stats = await httpRequest(`${BACKEND_BASE}/api/jobs/stats/summary`);
  assert(stats.status === 200 && stats.data?.totalJobs !== undefined,
    'GET /api/jobs/stats/summary 统计摘要',
    stats.status === 200 ? `职位${stats.data?.totalJobs}/投递${stats.data?.totalApplications}` : `HTTP ${stats.status}`);

  const firstJobId = jobs.data?.[0]?.id;
  const detail = firstJobId ? await httpRequest(`${BACKEND_BASE}/api/jobs/${firstJobId}`) : { status: 0 };
  assert(detail.status === 200 && detail.data?.id,
    `GET /api/jobs/:id 职位详情 (id=${firstJobId})`,
    detail.status === 200 ? detail.data?.title?.substring(0, 20) : `HTTP ${detail.status}`);

  const apps = await httpRequest(`${BACKEND_BASE}/api/applications`);
  assert(apps.status === 200 && Array.isArray(apps.data),
    'GET /api/applications 投递列表',
    apps.status === 200 ? `${apps.data?.length || 0} 条数据` : `HTTP ${apps.status}`);

  // 重复投递测试
  const existingApp = apps.data?.[0];
  if (existingApp) {
    const dup = await httpRequest(`${BACKEND_BASE}/api/applications`, 'POST', {
      jobId: existingApp.jobId,
      applicantName: existingApp.applicantName,
      email: existingApp.email,
      phone: existingApp.phone,
      resume: 'test'
    });
    assert(dup.status === 400 || dup.data?.error, 'POST 重复投递检测',
      `HTTP ${dup.status} - ${(dup.data?.error || '').substring(0, 30) || '无错误提示'}`);
  } else {
    assert(false, 'POST 重复投递检测', '无初始投递数据可测试');
  }

  // ========== 3. 前端页面检查 ==========
  divider('前端页面检查');

  const indexPage = await httpRequest(`${FRONTEND_BASE}/`, 'GET', null, 8000, 'text/html');
  assert(indexPage.status === 200 && typeof indexPage.raw === 'string' && indexPage.raw.includes('<div id="app">'),
    '根路径 / 返回 HTML 入口',
    `HTTP ${indexPage.status} - ${indexPage.raw?.includes('招聘平台') ? '含标题' : '无标题'}`);

  const jobsRoute = await httpRequest(`${FRONTEND_BASE}/jobs`, 'GET', null, 8000, 'text/html');
  assert(jobsRoute.status === 200 && typeof jobsRoute.raw === 'string' && jobsRoute.raw.includes('vite'),
    '/jobs 路由重定向 (SPA fallback)', `HTTP ${jobsRoute.status}`);

  const detailRoute = await httpRequest(`${FRONTEND_BASE}/job/1`, 'GET', null, 8000, 'text/html');
  assert(detailRoute.status === 200 && typeof detailRoute.raw === 'string',
    '/job/:id 职位详情路由', `HTTP ${detailRoute.status}`);

  const appsRoute = await httpRequest(`${FRONTEND_BASE}/applications`, 'GET', null, 8000, 'text/html');
  assert(appsRoute.status === 200, '/applications 投递记录/候选人处理路由', `HTTP ${appsRoute.status}`);

  const statsRoute = await httpRequest(`${FRONTEND_BASE}/stats`, 'GET', null, 8000, 'text/html');
  assert(statsRoute.status === 200, '/stats 统计看板路由', `HTTP ${statsRoute.status}`);

  const editRoute = await httpRequest(`${FRONTEND_BASE}/job/edit/1`, 'GET', null, 8000, 'text/html');
  assert(editRoute.status === 200, '/job/edit/:id 职位编辑路由', `HTTP ${editRoute.status}`);

  const newJobRoute = await httpRequest(`${FRONTEND_BASE}/job/new`, 'GET', null, 8000, 'text/html');
  assert(newJobRoute.status === 200, '/job/new 职位发布路由 (含投递入口)', `HTTP ${newJobRoute.status}`);

  const badRoute = await httpRequest(`${FRONTEND_BASE}/this-path-does-not-exist`, 'GET', null, 8000, 'text/html');
  assert(badRoute.status === 200, '未知路径 NotFound 路由 (SPA fallback)',
    `HTTP ${badRoute.status} - 返回 index.html 由 Vue 处理 404`);

  // ========== 4. API 代理检查 ==========
  divider('API 代理检查');

  const proxyJobs = await httpRequest(`${FRONTEND_BASE}/api/jobs`);
  assert(proxyJobs.status === 200 && Array.isArray(proxyJobs.data),
    `前端代理 /api/jobs → 后端`,
    `HTTP ${proxyJobs.status} - ${proxyJobs.data?.length || 0} 条`);

  // ========== 5. 汇总 ==========
  divider('汇总');
  console.log(`\n  通过: ${passed}/${TOTAL}`);
  console.log(`  失败: ${failed}/${TOTAL}`);
  console.log(`  成功率: ${Math.round((passed / TOTAL) * 100)}%`);

  if (failed === 0) {
    console.log(`\n  🎉 全部检查通过！`);
    console.log(`\n  8条核心复查路径 (对应 smoke 检查项):`);
    console.log(`    ① 首页 / 职位列表        ${FRONTEND_BASE}/           ← smoke [10]`);
    console.log(`    ② 职位列表(重定向)       ${FRONTEND_BASE}/jobs       ← smoke [11]`);
    console.log(`    ③ 职位详情 + 投递入口    ${FRONTEND_BASE}/job/1      ← smoke [12]`);
    console.log(`    ④ 候选人处理 + 沟通面板  ${FRONTEND_BASE}/applications ← smoke [13]`);
    console.log(`    ⑤ 统计看板               ${FRONTEND_BASE}/stats      ← smoke [14]`);
    console.log(`    ⑥ 职位编辑               ${FRONTEND_BASE}/job/edit/1 ← smoke [15]`);
    console.log(`    ⑦ 职位新增(含投递入口)   ${FRONTEND_BASE}/job/new    ← smoke [16]`);
    console.log(`    ⑧ 空白/404 路径 fallback ${FRONTEND_BASE}/any-bad-url`);
  } else {
    console.log(`\n  ⚠️  有 ${failed} 项未通过，请检查:`);
    if (!health.status || health.status !== 200) {
      console.log(`     - 后端未启动，运行: cd backend ; npm.cmd start`);
    }
    if (!indexPage.status || indexPage.status !== 200) {
      console.log(`     - 前端未启动，运行: cd frontend ; npm.cmd run dev`);
    }
  }
  console.log('');

  process.exit(failed === 0 ? 0 : 1);
}

main();
