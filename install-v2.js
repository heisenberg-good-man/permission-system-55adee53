const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const frontendDir = path.join(__dirname, 'frontend');
const cacheDir = path.join(__dirname, '.npm-cache');
const tmpDir = path.join(cacheDir, 'tmp');

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

console.log('=== Installing frontend deps with exec ===');

const env = {
  ...process.env,
  npm_config_cache: cacheDir,
  npm_config_tmp: tmpDir,
  npm_config_cache_min: 0,
  TMPDIR: tmpDir,
  TEMP: tmpDir,
  TMP: tmpDir
};

const cmd = `npm.cmd install --cache "${cacheDir}" --no-audit --no-fund`;
console.log('Command:', cmd);
console.log('cwd:', frontendDir);

const child = exec(cmd, {
  cwd: frontendDir,
  env: env,
  maxBuffer: 50 * 1024 * 1024,
  timeout: 300000
});

let output = '';

child.stdout.on('data', (data) => {
  const str = data.toString();
  output += str;
  console.log('[stdout]', str.trim().substring(0, 200));
});

child.stderr.on('data', (data) => {
  const str = data.toString();
  output += str;
  console.log('[stderr]', str.trim().substring(0, 200));
});

child.on('close', (code) => {
  console.log(`\nProcess exited with code ${code}`);
  
  const nodeModulesPath = path.join(frontendDir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const packages = fs.readdirSync(nodeModulesPath).filter(d => !d.startsWith('.'));
    console.log(`node_modules exists with ${packages.length} packages`);
  } else {
    console.log('node_modules does NOT exist');
  }
  
  if (code === 0) {
    console.log('✓ Install successful!');
  } else {
    console.log('✗ Install failed!');
    console.log('\nLast 2000 chars of output:');
    console.log(output.slice(-2000));
  }
});

child.on('error', (err) => {
  console.error('Failed to start process:', err);
});
