const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname);
const frontendDir = path.join(projectRoot, 'frontend');
const cacheDir = path.join(projectRoot, '.npm-cache');
const tmpDir = path.join(cacheDir, 'tmp');

console.log('=== Checking npm config ===');

try {
  const configResult = execSync('npm config list', { encoding: 'utf8', env: process.env });
  console.log('npm config:');
  console.log(configResult);
} catch (err) {
  console.log('Failed to get config:', err.message);
}

console.log('\n=== Testing with registry.npmmirror.com ===');

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const env = {
  ...process.env,
  npm_config_cache: cacheDir,
  npm_config_tmp: tmpDir,
  TMPDIR: tmpDir,
  TEMP: tmpDir,
  TMP: tmpDir
};

try {
  const result = execSync(
    'npm install --registry=https://registry.npmmirror.com --cache=' + cacheDir + ' --no-audit --no-fund',
    {
      cwd: frontendDir,
      env: env,
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'pipe']
    }
  );
  
  console.log('✓ npm install completed successfully!');
  console.log(result);
  
} catch (err) {
  console.error('✗ npm install failed!');
  console.error('Error message:', err.message);
  if (err.stderr) {
    console.error('\n--- stderr (first 2000 chars) ---');
    console.error(err.stderr.substring(0, 2000));
  }
  if (err.stdout) {
    console.error('\n--- stdout (first 2000 chars) ---');
    console.error(err.stdout.substring(0, 2000));
  }
  
  const nodeModulesPath = path.join(frontendDir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const packages = fs.readdirSync(nodeModulesPath).filter(d => !d.startsWith('.'));
    console.log(`\nBut found ${packages.length} packages in node_modules`);
  }
  
  process.exit(1);
}
