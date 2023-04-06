const https = require('https');
const secretApiKey = process.env.PIN_API_KEY;

const data = JSON.stringify({
  email: 'mixmaster@mic.com',
  name: 'Mr Mic',
  bank_account: {
    name: 'Mr Mixmaster Mic',
    bsb: '123456',
    number: '987654321'
  }
});

const options = {
  hostname: 'test-api.pinpayments.com',
  path: '/1/recipients',
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(secretApiKey).toString('base64')}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();


