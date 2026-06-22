const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');
const serverPath = path.join(backendDir, 'server.js');

console.log('Testing if backend is already running...');

const testReq = http.get('http://localhost:3001/api/health', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Backend is running!');
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    process.exit(0);
  });
});

testReq.on('error', (err) => {
  console.log('Backend not running, starting it...');
  console.log('Error:', err.message);
  
  const server = spawn('node', [serverPath], {
    cwd: backendDir,
    stdio: 'inherit'
  });
  
  server.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
  
  setTimeout(() => {
    console.log('\n--- Testing API after startup ---');
    const testReq2 = http.get('http://localhost:3001/api/health', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('Backend started successfully!');
        console.log('Status:', res.statusCode);
        console.log('Response:', data);
        process.exit(0);
      });
    });
    
    testReq2.on('error', (err) => {
      console.error('Server still not reachable:', err.message);
      process.exit(1);
    });
  }, 3000);
});

testReq.setTimeout(2000, () => {
  testReq.destroy(new Error('Timeout'));
});
