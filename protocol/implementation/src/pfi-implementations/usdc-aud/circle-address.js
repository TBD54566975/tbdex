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


function createAddress(walletId, callback) {
  const idempotencyKey = uuidv4();
  const data = JSON.stringify({
    idempotencyKey: idempotencyKey,
    currency: 'USD',
    chain: 'ETH'
  });

  const options = {
    hostname: 'api-sandbox.circle.com',
    path: `/v1/wallets/${walletId}/addresses`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`,
      'Content-Length': data.length,
      'Accept': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    let response_data = '';

    res.on('data', (d) => {
      response_data += d;
    });

    res.on('end', () => {
      const response_json = JSON.parse(response_data);
      const address = response_json.data.address;
      callback(address);
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

function checkBalance(walletId, callback) {
    const options = {
      hostname: 'api-sandbox.circle.com',
      path: `/v1/transfers?destinationWalletId=${walletId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${api_key}`
      }
    };
  
    const req = https.request(options, (res) => {
      let response_data = '';
  
      res.on('data', (d) => {
        response_data += d;
      });
  
      res.on('end', () => {
        const response_json = JSON.parse(response_data);
        callback(response_json);
      });
    });
  
    req.on('error', (error) => {
      console.error(error);
    });
  
    req.end();
  }



  //Wallet ID: 1015335492
  //Address: 0xf42d430b12f19b0a25dc894ab2743cbbc1874546

  //checkBalance("1015335492", (balance) => {
  //  console.log(balance.data[0].amount);
  //});

  createWallet((walletId) => {
    console.log(`Wallet ID: ${walletId}`);
    createAddress(walletId, (address) => {
        console.log(`Address: ${address}`);
        setInterval(() => {
            checkBalance(walletId, (balance) => {
                console.log(`Balance: ${balance}`);
                console.log(balance);
            });
        }, 2000); // 2 seconds in milliseconds
    });    
});
