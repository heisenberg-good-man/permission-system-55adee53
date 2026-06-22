const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const backendDir = path.join(__dirname, 'backend');
const backendLog = path.join(__dirname, 'backend-run.log');

const log = fs.openSync(backendLog, 'w');

const backend = spawn('node', ['server.js'], {
  cwd: backendDir,
  stdio: ['ignore', log, log],
  detached: true,
  shell: true
});

backend.unref();

console.log('[Backend] PID:', backend.pid);
console.log('[Backend] Log:', backendLog);
console.log('[Backend] Started as detached process');

setTimeout(() => {
  const http = require('http');
  const req = http.get('http://localhost:3001/api/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('[Backend] Health check passed:', data);
    });
  });
  req.on('error', (e) => {
    console.log('[Backend] Health check failed:', e.message);
  });
}, 3000);
