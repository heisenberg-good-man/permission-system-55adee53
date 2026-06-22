const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const frontendDir = path.join(__dirname, 'frontend');
const cacheDir = path.join(__dirname, '.npm-cache');
const tmpDir = path.join(cacheDir, 'tmp');

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

console.log('Installing frontend dependencies...');
console.log('Working directory:', frontendDir);
console.log('Cache directory:', cacheDir);
console.log('Temp directory:', tmpDir);

try {
  const result = execSync(
    `npm install --cache "${cacheDir}" --tmp "${tmpDir}" --prefer-offline`,
    {
      cwd: frontendDir,
      encoding: 'utf8',
      stdio: 'pipe',
      maxBuffer: 10 * 1024 * 1024
    }
  );
  console.log('Install successful!');
  console.log(result);
} catch (err) {
  console.error('Install failed!');
  console.error('Error:', err.message);
  if (err.stdout) console.error('stdout:', err.stdout);
  if (err.stderr) console.error('stderr:', err.stderr);
  process.exit(1);
}
