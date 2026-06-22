const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const backendDir = path.join(__dirname, 'backend');
const serverPath = path.join(backendDir, 'server.js');
const logFile = path.join(__dirname, 'backend.log');

console.log('Starting backend server...');

const logStream = fs.createWriteStream(logFile, { flags: 'a' });

const server = spawn('node', [serverPath], {
  cwd: backendDir,
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true
});

server.stdout.pipe(logStream);
server.stderr.pipe(logStream);
process.stdout.pipe(logStream);

server.stdout.on('data', (data) => {
  console.log(`[Server] ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`[Server Error] ${data}`);
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  logStream.end();
});

server.unref();

console.log(`Backend server started with PID: ${server.pid}`);
console.log(`Log file: ${logFile}`);

setTimeout(() => {
  console.log('\nChecking if server is responsive...');
  const http = require('http');
  const req = http.get('http://localhost:3001/api/health', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log(`Server responded with status ${res.statusCode}`);
      console.log(`Response: ${data}`);
      console.log('\nBackend server is running in background!');
      process.exit(0);
    });
  });
  
  req.on('error', (err) => {
    console.error('Server not responsive yet:', err.message);
  });
  
  req.setTimeout(3000, () => {
    req.destroy(new Error('Timeout'));
  });
}, 2000);
