const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const backendDir = path.join(projectRoot, 'backend');
const frontendDir = path.join(projectRoot, 'frontend');
const cacheDir = path.join(projectRoot, '.npm-cache');

fs.mkdirSync(cacheDir, { recursive: true });

const backendExpress = path.join(backendDir, 'node_modules', 'express', 'package.json');
const frontendVue = path.join(frontendDir, 'node_modules', 'vue', 'package.json');

if (fs.existsSync(backendExpress)) {
  console.log('[Step 1] Backend deps already installed. Express:', require(backendExpress).version);
} else {
  console.log('[Step 1] Installing backend dependencies...');
  try {
    execSync('npm.cmd install --no-audit --no-fund', {
      cwd: backendDir,
      stdio: 'inherit',
      env: { ...process.env, npm_config_cache: cacheDir }
    });
    console.log('[Step 1] Backend install done. Express exists:', fs.existsSync(backendExpress));
  } catch (e) {
    console.error('[Step 1] Backend install failed:', e.message);
  }
}

if (fs.existsSync(frontendVue)) {
  console.log('[Step 2] Frontend deps already installed. Vue:', require(frontendVue).version);
} else {
  console.log('[Step 2] Installing frontend dependencies...');
  try {
    execSync('npm.cmd install --no-audit --no-fund', {
      cwd: frontendDir,
      stdio: 'inherit',
      env: { ...process.env, npm_config_cache: cacheDir }
    });
    console.log('[Step 2] Frontend install done. Vue exists:', fs.existsSync(frontendVue));
  } catch (e) {
    console.error('[Step 2] Frontend install failed:', e.message);
  }
}
