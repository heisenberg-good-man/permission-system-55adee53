const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const projectRoot = path.join(__dirname);
const frontendDir = path.join(projectRoot, 'frontend');
const cacheDir = path.join(projectRoot, '.npm-cache');
const tmpDir = path.join(cacheDir, 'tmp');

console.log('Installing frontend dependencies...');
console.log('Frontend dir:', frontendDir);
console.log('Cache dir:', cacheDir);

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
console.log('Using npm command:', npmCmd);

const env = {
  ...process.env,
  npm_config_cache: cacheDir,
  npm_config_tmp: tmpDir,
};

try {
  console.log('\nRunning npm install... (this may take a few minutes)');
  
  const result = execSync(`${npmCmd} install --no-audit --no-fund --loglevel=error`, {
    cwd: frontendDir,
    env: env,
    encoding: 'utf8',
    maxBuffer: 100 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  console.log('✓ npm install completed!');
  if (result.trim()) {
    console.log('Output:', result);
  }
  
} catch (err) {
  console.error('✗ npm install failed!');
  console.error('Error:', err.message);
  if (err.stderr) {
    console.error('\n--- stderr ---');
    console.error(err.stderr.substring(0, 3000));
  }
  if (err.stdout) {
    console.error('\n--- stdout ---');
    console.error(err.stdout.substring(0, 3000));
  }
  
  const nodeModulesPath = path.join(frontendDir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const packages = fs.readdirSync(nodeModulesPath).filter(d => !d.startsWith('.'));
    console.log(`\nBut node_modules exists with ${packages.length} packages`);
  }
  
  process.exit(1);
}

const nodeModulesPath = path.join(frontendDir, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  const packages = fs.readdirSync(nodeModulesPath).filter(d => !d.startsWith('.'));
  console.log(`\n✓ Successfully installed ${packages.length} packages!`);
  
  const importantPkgs = ['vue', 'vue-router', 'axios', 'vite', '@vitejs/plugin-vue'];
  console.log('\nKey packages:');
  for (const pkg of importantPkgs) {
    const exists = fs.existsSync(path.join(nodeModulesPath, pkg));
    console.log(`  ${pkg}: ${exists ? '✓' : '✗'}`);
  }
} else {
  console.log('\n✗ node_modules not found after install');
  process.exit(1);
}

console.log('\n✓ Frontend dependencies installed successfully!');
