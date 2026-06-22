const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const frontendDir = path.join(__dirname, 'frontend');
const cacheDir = path.join(__dirname, '.npm-cache');
const tmpDir = path.join(cacheDir, 'tmp');

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

console.log('=== Debug npm install ===');
console.log('cwd:', frontendDir);
console.log('cache:', cacheDir);
console.log('tmp:', tmpDir);

const npmCmd = 'npm.cmd';
const args = ['install', '--cache', cacheDir, '--no-audit', '--no-fund', '--loglevel=verbose'];

console.log('\nCommand:', npmCmd, args.join(' '));

try {
  const output = execFileSync(npmCmd, args, {
    cwd: frontendDir,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
    timeout: 300000,
    env: {
      ...process.env,
      TMPDIR: tmpDir,
      TEMP: tmpDir,
      TMP: tmpDir
    }
  });
  
  console.log('\n=== SUCCESS ===');
  console.log(output.substring(0, 2000));
  
} catch (err) {
  console.log('\n=== FAILED ===');
  console.log('Error message:', err.message);
  console.log('Error code:', err.code);
  
  if (err.stdout) {
    console.log('\n--- stdout (first 3000 chars) ---');
    console.log(err.stdout.substring(0, 3000));
  }
  
  if (err.stderr) {
    console.log('\n--- stderr (first 3000 chars) ---');
    console.log(err.stderr.substring(0, 3000));
  }
  
  const nodeModulesPath = path.join(frontendDir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const packages = fs.readdirSync(nodeModulesPath).filter(d => !d.startsWith('.'));
    console.log(`\nBut node_modules has ${packages.length} packages`);
  }
}
