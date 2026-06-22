const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const projectRoot = path.join(__dirname);
const frontendDir = path.join(projectRoot, 'frontend');
const cacheDir = path.join(projectRoot, '.npm-cache');
const tmpDir = path.join(cacheDir, 'tmp');

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

console.log('Installing frontend dependencies...');
console.log('Frontend dir:', frontendDir);
console.log('Cache dir:', cacheDir);

const env = {
  ...process.env,
  npm_config_cache: cacheDir,
  npm_config_tmp: tmpDir,
  npm_config_prefix: path.join(cacheDir, 'prefix'),
  TMPDIR: tmpDir,
  TEMP: tmpDir,
  TMP: tmpDir
};

try {
  const result = execSync('npm install', {
    cwd: frontendDir,
    env: env,
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  console.log('✓ npm install completed successfully!');
  
  const nodeModulesPath = path.join(frontendDir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const packages = fs.readdirSync(nodeModulesPath).filter(d => !d.startsWith('.'));
    console.log(`✓ Found ${packages.length} packages in node_modules`);
  }
  
  console.log('\nDependencies installed successfully!');
  
} catch (err) {
  console.error('✗ npm install failed!');
  console.error('Error:', err.message);
  if (err.stderr) {
    console.error('\n--- stderr ---');
    console.error(err.stderr);
  }
  if (err.stdout) {
    console.error('\n--- stdout ---');
    console.error(err.stdout);
  }
  process.exit(1);
}
