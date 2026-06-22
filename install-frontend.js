const { execSync } = require('child_process');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const cacheDir = path.join(__dirname, '.npm-cache');

console.log('Installing frontend dependencies...');
console.log('Working directory:', frontendDir);

try {
  const result = execSync('npm install', {
    cwd: frontendDir,
    env: { 
      ...process.env, 
      npm_config_cache: cacheDir
    },
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log('Install successful!');
  console.log(result);
} catch (err) {
  console.error('Install failed!');
  console.error('Error:', err.message);
  if (err.stdout) console.error('stdout:', err.stdout);
  if (err.stderr) console.error('stderr:', err.stderr);
  process.exit(1);
}
