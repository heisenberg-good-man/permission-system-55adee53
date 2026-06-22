const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const frontendDir = path.join(__dirname, 'frontend');
const cacheDir = path.join(__dirname, '.npm-cache');

console.log('Building frontend...');
console.log('Frontend dir:', frontendDir);
console.log('Cache dir:', cacheDir);

try {
  const env = {
    ...process.env,
    npm_config_cache: cacheDir
  };
  
  const output = execSync('npm.cmd run build', {
    cwd: frontendDir,
    env: env,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
    timeout: 180000
  });
  
  console.log('\n=== Build Output ===');
  console.log(output);
  
  const distDir = path.join(frontendDir, 'dist');
  if (fs.existsSync(distDir)) {
    console.log('\n✓ Build successful!');
    console.log('  Dist dir:', distDir);
    
    const files = [];
    function walk(dir, prefix = '') {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          files.push(`${prefix}${item}/`);
          walk(fullPath, `${prefix}  `);
        } else {
          files.push(`${prefix}${item} (${stat.size} bytes)`);
        }
      }
    }
    walk(distDir);
    
    console.log('  Files:');
    for (const f of files) {
      console.log('    ', f);
    }
  } else {
    console.log('\n✗ Build failed: dist directory not found');
  }
  
} catch (err) {
  console.error('\n✗ Build failed!');
  console.error('Error:', err.message);
  
  if (err.stdout) {
    console.log('\n--- stdout ---');
    console.log(err.stdout);
  }
  
  if (err.stderr) {
    console.log('\n--- stderr ---');
    console.log(err.stderr);
  }
}
