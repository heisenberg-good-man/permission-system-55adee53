const http = require('http');

const port = 5173;

const options = {
  hostname: 'localhost',
  port: port,
  path: '/',
  method: 'GET'
};

console.log(`Checking frontend on port ${port}...`);

const req = http.request(options, (res) => {
  console.log(`✓ Frontend is running!`);
  console.log(`  Status: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`  Body length: ${data.length} bytes`);
    console.log(`  First 500 chars: ${data.substring(0, 500)}`);
  });
});

req.on('error', (e) => {
  console.error(`✗ Frontend is NOT running: ${e.message}`);
});

req.setTimeout(5000, () => {
  console.error('✗ Request timeout');
  req.destroy();
});

req.end();
