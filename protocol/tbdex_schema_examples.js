let offering = {
  "description": "Buy BTC with USD!",
  "pair": "BTC_USD",
  "unitPrice": "27000.00",
  "baseFee": "1.00",
  "min": "10.00",
  "max": "1000.00",
  "presentationRequestJwt": "eyJhb...MIDw",
  "payinInstruments": [{
    "kind": "DEBIT_CARD",
    "fee": {
      "flatFee": "1.00"
    }
  }],
  "payoutInstruments": [{
    "kind": "BTC_ADDRESS"
  }]
}

let rfq = {
  "pair": "BTC_USD",
  "amount": "10.00",
  "verifiablePresentationJwt": "...",
  "payinInstrument": {
    "kind": "DEBIT_CARD"
  },
  "payoutInstrument": {
    "kind": "BTC_ADDRESS"
  }
}

let quote = {
  "expiryTime": "2023-04-14T12:12:12Z",
  "totalFee": "2.00",
  "amount": "0.000383",
  "paymentPresentationRequestJwt": "eyJhbGc...EWfNnAw",
  "paymentInstructions": {
    "payin": {
      "link": "stripe.com?for=alice"
    }
  }
}

let order = {
  "paymentVerifiablePresentationJwt": "..."
}

let orderStatus = {
  "orderStatus": "PENDING"
}