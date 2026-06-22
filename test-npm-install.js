const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname);
const frontendDir = path.join(projectRoot, 'frontend');
const cacheDir = path.join(projectRoot, '.npm-cache');
const tmpDir = path.join(cacheDir, 'tmp');

console.log('=== Test 1: Check if npm works ===');
try {
  const version = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log('✓ npm version:', version);
} catch (err) {
  console.log('✗ npm not found:', err.message);
}

console.log('\n=== Test 2: Check frontend dir ===');
console.log('Frontend dir exists:', fs.existsSync(frontendDir));
console.log('package.json exists:', fs.existsSync(path.join(frontendDir, 'package.json')));

console.log('\n=== Test 3: Run npm install with spawn ===');

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const env = {
  ...process.env,
  npm_config_cache: cacheDir,
  npm_config_tmp: tmpDir,
};

const child = spawn('npm', ['install', '--no-audit', '--no-fund'], {
  cwd: frontendDir,
  env: env,
  stdio: ['pipe', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';

child.stdout.on('data', (data) => {
  const str = data.toString();
  stdout += str;
  console.log('[npm stdout]', str.trim());
});

child.stderr.on('data', (data) => {
  const str = data.toString();
  stderr += str;
  console.log('[npm stderr]', str.trim());
});

child.on('close', (code) => {
  console.log(`\nnpm process exited with code ${code}`);
  
  const nodeModulesPath = path.join(frontendDir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const packages = fs.readdirSync(nodeModulesPath).filter(d => !d.startsWith('.'));
    console.log(`✓ node_modules exists with ${packages.length} packages`);
    console.log('First 10 packages:', packages.slice(0, 10));
  } else {
    console.log('✗ node_modules does not exist');
  }
  
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Failed to start npm:', err);
  process.exit(1);
});

setTimeout(() => {
  console.log('\n⏱ Timeout after 120 seconds, checking current state...');
  const nodeModulesPath = path.join(frontendDir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const packages = fs.readdirSync(nodeModulesPath).filter(d => !d.startsWith('.'));
    console.log(`node_modules has ${packages.length} packages so far`);
  } else {
    console.log('node_modules still does not exist');
  }
  console.log('Killing npm process...');
  child.kill();
}, 120000);
