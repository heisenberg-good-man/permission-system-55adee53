const { spawn } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

console.log('[Step 3] Starting backend server...');
const backend = spawn('node', ['server.js'], {
  cwd: backendDir,
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  console.log('[Backend]', data.toString().trim());
});

backend.stderr.on('data', (data) => {
  console.error('[Backend Error]', data.toString().trim());
});

backend.on('close', (code) => {
  console.log(`[Backend] Process exited with code ${code}`);
});

setTimeout(() => {
  console.log('[Step 4] Starting frontend dev server...');
  const frontend = spawn('npx.cmd', ['vite', '--host'], {
    cwd: frontendDir,
    stdio: 'pipe',
    shell: true,
    env: { ...process.env }
  });

  frontend.stdout.on('data', (data) => {
    console.log('[Frontend]', data.toString().trim());
  });

  frontend.stderr.on('data', (data) => {
    console.error('[Frontend Error]', data.toString().trim());
  });

  frontend.on('close', (code) => {
    console.log(`[Frontend] Process exited with code ${code}`);
  });
}, 3000);

process.on('SIGINT', () => {
  backend.kill();
  process.exit();
});
