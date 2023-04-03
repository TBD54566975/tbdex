const https = require('https');
const secretApiKey = process.env.PIN_API_KEY;

const data = JSON.stringify({
  amount: 400,
  currency: 'AUD',
  description: 'Earnings for may',
  recipient: 'rp_tmOpI_zgD-1bP1_poNHDew'
});

const options = {
  hostname: 'test-api.pinpayments.com',
  path: '/1/transfers',
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
