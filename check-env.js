const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '.npm-cache');
console.log('Cache dir:', cacheDir);
console.log('Exists:', fs.existsSync(cacheDir));

if (fs.existsSync(cacheDir)) {
  const files = fs.readdirSync(cacheDir);
  console.log('Contents:', files);
}

const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');
console.log('\nBackend node_modules exists:', fs.existsSync(backendNodeModules));

const frontendNodeModules = path.join(__dirname, 'frontend', 'node_modules');
console.log('Frontend node_modules exists:', fs.existsSync(frontendNodeModules));
