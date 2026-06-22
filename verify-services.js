const http = require('http');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function verify() {
  const results = [];

  console.log('=== 验证开始 ===\n');

  // Test 1: Backend health check
  console.log('[Test 1] http://localhost:3001/api/health');
  try {
    const healthRes = await httpGet('http://localhost:3001/api/health');
    const isHealthOk = healthRes.statusCode === 200;
    console.log(`  Status: ${healthRes.statusCode}`);
    console.log(`  Body: ${healthRes.body.substring(0, 200)}`);
    console.log(`  Result: ${isHealthOk ? 'PASS' : 'FAIL'}\n`);
    results.push({ name: 'Backend /api/health', pass: isHealthOk, statusCode: healthRes.statusCode });
  } catch (e) {
    console.log(`  Error: ${e.message}`);
    console.log(`  Result: FAIL\n`);
    results.push({ name: 'Backend /api/health', pass: false, error: e.message });
  }

  // Test 2: Frontend HTML
  console.log('[Test 2] http://localhost:5173/');
  try {
    const htmlRes = await httpGet('http://localhost:5173/');
    const isHtml = htmlRes.statusCode === 200 && htmlRes.body.includes('<html');
    console.log(`  Status: ${htmlRes.statusCode}`);
    console.log(`  Content-Type: ${htmlRes.headers['content-type']}`);
    console.log(`  Body length: ${htmlRes.body.length}`);
    console.log(`  Contains <html>: ${htmlRes.body.includes('<html')}`);
    console.log(`  Result: ${isHtml ? 'PASS' : 'FAIL'}\n`);
    results.push({ name: 'Frontend /', pass: isHtml, statusCode: htmlRes.statusCode });
  } catch (e) {
    console.log(`  Error: ${e.message}`);
    console.log(`  Result: FAIL\n`);
    results.push({ name: 'Frontend /', pass: false, error: e.message });
  }

  // Test 3: Frontend proxy to /api/jobs
  console.log('[Test 3] http://localhost:5173/api/jobs');
  try {
    const jobsRes = await httpGet('http://localhost:5173/api/jobs');
    let isJobsOk = jobsRes.statusCode === 200;
    let jobsData = null;
    try {
      jobsData = JSON.parse(jobsRes.body);
      if (Array.isArray(jobsData)) {
        console.log(`  Jobs count: ${jobsData.length}`);
      } else if (jobsData.data && Array.isArray(jobsData.data)) {
        console.log(`  Jobs count: ${jobsData.data.length}`);
      }
    } catch (parseErr) {
      isJobsOk = false;
    }
    console.log(`  Status: ${jobsRes.statusCode}`);
    console.log(`  Body: ${jobsRes.body.substring(0, 300)}`);
    console.log(`  Result: ${isJobsOk ? 'PASS' : 'FAIL'}\n`);
    results.push({ name: 'Frontend /api/jobs (proxy)', pass: isJobsOk, statusCode: jobsRes.statusCode });
  } catch (e) {
    console.log(`  Error: ${e.message}`);
    console.log(`  Result: FAIL\n`);
    results.push({ name: 'Frontend /api/jobs (proxy)', pass: false, error: e.message });
  }

  console.log('=== 验证总结 ===');
  const passCount = results.filter(r => r.pass).length;
  results.forEach(r => {
    console.log(`  ${r.pass ? '✓' : '✗'} ${r.name}: ${r.pass ? 'PASS' : 'FAIL'}${r.error ? ' (' + r.error + ')' : ''}`);
  });
  console.log(`\n通过: ${passCount}/${results.length}`);
  console.log(passCount === results.length ? '\n所有验证均通过！' : '\n部分验证失败，请检查。');
}

verify().catch(console.error);
