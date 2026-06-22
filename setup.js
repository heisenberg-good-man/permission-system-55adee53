const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname);
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');
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

function run(cmd, cwd, label) {
  console.log(`\n[${label}] Running: ${cmd}`);
  console.log(`[${label}] CWD: ${cwd}`);
  try {
    const output = execSync(cmd, {
      cwd,
      env,
      encoding: 'utf8',
      maxBuffer: 30 * 1024 * 1024,
      timeout: 300000,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log(`[${label}] SUCCESS`);
    if (output.trim()) console.log(output.trim().substring(0, 500));
    return true;
  } catch (err) {
    console.error(`[${label}] FAILED: ${err.message}`);
    if (err.stdout) console.log('stdout:', err.stdout.substring(0, 500));
    if (err.stderr) console.log('stderr:', err.stderr.substring(0, 500));
    return false;
  }
}

console.log('=== Step 1: Install backend dependencies ===');
const backendOk = run('npm.cmd install --no-audit --no-fund', backendDir, 'backend-install');

console.log('\n=== Step 2: Install frontend dependencies ===');
const frontendOk = run('npm.cmd install --no-audit --no-fund', frontendDir, 'frontend-install');

console.log('\n=== Step 3: Verify installations ===');
const backendModules = fs.existsSync(path.join(backendDir, 'node_modules', 'express'));
const frontendModules = fs.existsSync(path.join(frontendDir, 'node_modules', 'vue'));
console.log(`Backend express installed: ${backendModules}`);
console.log(`Frontend vue installed: ${frontendModules}`);

if (!backendModules || !frontendModules) {
  console.error('\nERROR: Dependencies not installed properly!');
  process.exit(1);
}

console.log('\n=== All dependencies installed successfully! ===');
