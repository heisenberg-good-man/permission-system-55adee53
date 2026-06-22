const { execSync } = require('child_process');

try {
  const result = execSync('netstat -ano | findstr :3001', { encoding: 'utf8' });
  console.log('Port 3001 status:');
  console.log(result);
  
  const lines = result.trim().split('\n');
  for (const line of lines) {
    if (line.includes('LISTENING')) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      console.log(`Found PID: ${pid}`);
      if (pid) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { encoding: 'utf8' });
          console.log(`Killed PID ${pid}`);
        } catch (killErr) {
          console.error(`Failed to kill PID ${pid}:`, killErr.message);
        }
      }
    }
  }
} catch (err) {
  console.log('No process found on port 3001');
}
