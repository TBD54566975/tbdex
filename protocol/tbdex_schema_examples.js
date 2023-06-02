let offering = {
  "pair": "BTC_USD",
  "unitPrice": 27000.00,
  "fee": 1.00,
  "min": 10.00,
  "max": 100.00,
  "presentationRequest": { },
  "payinInstruments": [{
      "kind": "DEBIT_CARD",
      "fee": 1,
      "presentationRequest": {},
  }],
  "payoutInstruments": [{
      "kind": "BTC_ADDRESS",
      "presentationRequest": {}
  }]
}

let rfq = {
  "rfqId": "1",
  "pair": "BTC_USD",
  "amount": 10.00,
  "verifiablePresentation": { },
  "payin_instrument": {
      "kind": "DEBIT_CARD"
  },
  "payout_instrument": {
      "kind": "BTC_ADDRESS"
  }
}

let quote = {
  "rfqId": "1",
  "quoteId": "2",
  "expiryTime": "2023-04-14T12:12:12Z",
  "totalFee": 1.00,
  "amount": 0.000383,
  "paymentPresentationRequest": { }
}

let order = {
    "orderId": 32432,
    "quoteId": 2,
    "paymentVerifiablePresentation": { }
}

let orderStatus = {
    "orderId": 32432,
    "orderStatus": "PENDING"
}