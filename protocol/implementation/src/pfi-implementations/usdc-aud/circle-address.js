const https = require('https');
const { v4: uuidv4 } = require('uuid');
const api_key = process.env.CIRCLE_API_KEY;

function createWallet(callback) {
  const idempotencyKey = uuidv4();
  const data = JSON.stringify({
    idempotencyKey: idempotencyKey
  });

  const options = {
    hostname: 'api-sandbox.circle.com',
    path: '/v1/wallets',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`,
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    let response_data = '';

    res.on('data', (d) => {
      response_data += d;
    });

    res.on('end', () => {
      const response_json = JSON.parse(response_data);
      const wallet_id = response_json.data.walletId;
      callback(wallet_id);
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

createWallet((walletId) => {
  console.log(`Wallet ID: ${walletId}`);
});
