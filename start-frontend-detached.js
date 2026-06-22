const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const frontendDir = path.join(__dirname, 'frontend');
const frontendLog = path.join(__dirname, 'frontend-run.log');

const log = fs.openSync(frontendLog, 'w');

const frontend = spawn('npx.cmd', ['vite', '--host'], {
  cwd: frontendDir,
  stdio: ['ignore', log, log],
  detached: true,
  shell: true
});

frontend.unref();

console.log('[Frontend] PID:', frontend.pid);
console.log('[Frontend] Log:', frontendLog);
console.log('[Frontend] Started as detached process');

setTimeout(() => {
  const http = require('http');
  const req = http.get('http://localhost:5173/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('[Frontend] Check passed, status:', res.statusCode, 'content-length:', data.length);
    });
  });
  req.on('error', (e) => {
    console.log('[Frontend] Check failed:', e.message);
  });
}, 8000);
