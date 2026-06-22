const { spawn, exec } = require('child_process');
const path = require('path');
const http = require('http');

const frontendDir = path.join(__dirname, 'frontend');
const cacheDir = path.join(__dirname, '.npm-cache');
const port = 5173;

console.log('Starting frontend dev server...');
console.log('Frontend dir:', frontendDir);
console.log('Cache dir:', cacheDir);
console.log('Port:', port);

const env = {
  ...process.env,
  npm_config_cache: cacheDir,
  VITE_PORT: port
};

const child = exec('npm.cmd run dev', {
  cwd: frontendDir,
  env: env,
  maxBuffer: 10 * 1024 * 1024
});

let output = '';

child.stdout.on('data', (data) => {
  const str = data.toString();
  output += str;
  console.log('[vite]', str.trim());
});

child.stderr.on('data', (data) => {
  const str = data.toString();
  output += str;
  console.log('[vite-err]', str.trim());
});

child.on('close', (code) => {
  console.log(`\nFrontend dev server exited with code ${code}`);
});

child.on('error', (err) => {
  console.error('Failed to start frontend:', err.message);
});

function checkServer() {
  const options = {
    hostname: 'localhost',
    port: port,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`\n✓ Frontend dev server is running!`);
    console.log(`  Status: ${res.statusCode}`);
    console.log(`  URL: http://localhost:${port}`);
  });

  req.on('error', (e) => {
    console.log('Waiting for server to start...');
    setTimeout(checkServer, 3000);
  });

  req.setTimeout(5000, () => {
    req.destroy();
  });

  req.end();
}

setTimeout(checkServer, 5000);
