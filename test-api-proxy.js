const http = require('http');

const port = 5173;

const options = {
  hostname: 'localhost',
  port: port,
  path: '/api/jobs',
  method: 'GET'
};

console.log(`Testing API proxy via frontend (port ${port})...`);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Body length: ${data.length} bytes`);
    try {
      const json = JSON.parse(data);
      console.log(`Success! Got ${json.length || json.total || 'N/A'} jobs`);
      if (Array.isArray(json) && json.length > 0) {
        console.log('First job:', JSON.stringify(json[0], null, 2));
      } else if (json.data && Array.isArray(json.data)) {
        console.log('First job:', JSON.stringify(json.data[0], null, 2));
      }
    } catch (e) {
      console.log('Body:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.setTimeout(10000, () => {
  console.error('Request timeout');
  req.destroy();
});

req.end();
