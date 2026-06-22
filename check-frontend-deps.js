const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const nodeModulesPath = path.join(frontendDir, 'node_modules');
const pkgLockPath = path.join(frontendDir, 'package-lock.json');

console.log('=== Frontend Installation Status ===');
console.log('Frontend dir:', frontendDir);
console.log('node_modules exists:', fs.existsSync(nodeModulesPath));
console.log('package-lock.json exists:', fs.existsSync(pkgLockPath));

if (fs.existsSync(nodeModulesPath)) {
  const packages = fs.readdirSync(nodeModulesPath).filter(d => !d.startsWith('.'));
  console.log('Number of packages:', packages.length);
  console.log('Packages:', packages.slice(0, 20).join(', '));
  if (packages.length > 20) {
    console.log(`... and ${packages.length - 20} more`);
  }
}

if (fs.existsSync(pkgLockPath)) {
  const stats = fs.statSync(pkgLockPath);
  console.log('package-lock.json modified:', stats.mtime);
  console.log('package-lock.json size:', stats.size, 'bytes');
}

const importantPkgs = ['vue', 'vue-router', 'axios', 'vite', '@vitejs/plugin-vue'];
console.log('\n=== Key Package Check ===');
for (const pkg of importantPkgs) {
  const pkgPath = path.join(nodeModulesPath, pkg);
  const exists = fs.existsSync(pkgPath);
  console.log(`  ${pkg}: ${exists ? '✓ installed' : '✗ missing'}`);
  
  if (exists) {
    try {
      const pkgJsonPath = path.join(pkgPath, 'package.json');
      if (fs.existsSync(pkgJsonPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        console.log(`    version: ${pkgJson.version}`);
      }
    } catch (e) {
      // ignore
    }
  }
}
