const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const cacheDir = path.join(rootDir, '.npm-cache');
const tmpDir = path.join(cacheDir, 'tmp');

if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const env = {
  ...process.env,
  npm_config_cache: cacheDir,
  npm_config_tmp: tmpDir,
  TEMP: tmpDir,
  TMP: tmpDir
};

console.log('Installing backend...');
try {
  execSync('npm.cmd install --no-audit --no-fund', {
    cwd: backendDir,
    env,
    encoding: 'utf8',
    timeout: 120000
  });
  console.log('Backend: OK');
} catch (e) {
  console.log('Backend install error:', e.message.substring(0, 200));
}

console.log('Backend express installed:', fs.existsSync(path.join(backendDir, 'node_modules', 'express', 'package.json')));
