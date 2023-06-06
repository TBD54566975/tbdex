let offering = {
  "description": "Buy BTC with USD, much wow!",
  "pair": "BTC_USD",
  "unitPrice": 27000.00,
  "baseFee": 1.00,
  "min": 10.00,
  "max": 100.00,
  "presentationRequestJwt": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa3NpcEpqd1RZb2Y2YXRiQnJreDVienJTTVhyUVVkZkJlOGFqcmhaY3JieFhuI3o2TWtzaXBKandUWW9mNmF0YkJya3g1YnpyU01YclFVZGZCZThhanJoWmNyYnhYbiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODYwOTE2NTksImlhdCI6MTY4NjA5MTY1OSwiaXNzIjoiZGlkOmtleTp6Nk1rc2lwSmp3VFlvZjZhdGJCcmt4NWJ6clNNWHJRVWRmQmU4YWpyaFpjcmJ4WG4iLCJqdGkiOiJhNWFkYzM2OC1lYWM3LTQ0ZTMtYjlhMi04ZDE3MTY1MmFjYzUiLCJuYmYiOjE2ODYwOTE2NTksInByZXNlbnRhdGlvbl9kZWZpbml0aW9uIjp7ImlkIjoiM2E2NjM0OTgtMjNjYy00NWQ3LThjNzYtZTJhZWUxMzdmYTdkIiwiaW5wdXRfZGVzY3JpcHRvcnMiOlt7ImNvbnN0cmFpbnRzIjp7ImZpZWxkcyI6W3sibmFtZSI6IkZ1bGwgTmFtZSIsInBhdGgiOlsiJC5mdWxsTmFtZSIsIiQudmMuZnVsbE5hbWUiXX0seyJuYW1lIjoiRGF0ZSBvZiBCaXJ0aCIsInBhdGgiOlsiJC5kYXRlT2ZCaXJ0aCIsIiQudmMuZGF0ZU9mQmlydGgiLCIkLmRvYiIsIiQudmMuZG9iIl19XX0sImlkIjoiMCIsInB1cnBvc2UiOiJLWUMgVkMifV0sIm5hbWUiOiJLWUMgVkMgUHJlc2VudGF0aW9uIERlZmluaXRpb24iLCJwdXJwb3NlIjoiUHJvdmlkZSBpbmZvIHNvIHdlIGtub3cgeW91IGFyZSBub3QgYSBiYWRkaWUifX0.bL8br3_5jkHZF6XAFtoVa4opBw_zfBtYYEynxA9jD8uvZ1tJC47uQ8aG_Ds6odFaZNgY3tf0uWFcrK9S-0MIDw",
  "payinInstruments": [{
      "kind": "DEBIT_CARD",
      "fee": {
        "flatFee": 1.00
      }
  }],
  "payoutInstruments": [{
      "kind": "BTC_ADDRESS"
  }]
}

let rfq = {
  "rfqId": "1",
  "pair": "BTC_USD",
  "amount": 10.00,
  "verifiablePresentation": { },
  "payinInstrument": {
      "kind": "DEBIT_CARD"
  },
  "payoutInnstrument": {
      "kind": "BTC_ADDRESS"
  }
}

let quote = {
  "rfqId": "1",
  "quoteId": "2",
  "expiryTime": "2023-04-14T12:12:12Z",
  "totalFee": 2.00,
  "amount": 0.000383,
  "paymentPresentationRequestJwt": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa3NpcEpqd1RZb2Y2YXRiQnJreDVienJTTVhyUVVkZkJlOGFqcmhaY3JieFhuI3o2TWtzaXBKandUWW9mNmF0YkJya3g1YnpyU01YclFVZGZCZThhanJoWmNyYnhYbiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODYwODE3NTYsImlhdCI6MTY4NjA4MTc1NiwiaXNzIjoiZGlkOmtleTp6Nk1rc2lwSmp3VFlvZjZhdGJCcmt4NWJ6clNNWHJRVWRmQmU4YWpyaFpjcmJ4WG4iLCJqdGkiOiIyNTQ2YjZkNi0yYzlkLTRjNzEtYjlhNi02ZDI3OWJiNzdlYjciLCJuYmYiOjE2ODYwODE3NTYsInByZXNlbnRhdGlvbl9kZWZpbml0aW9uIjp7ImlkIjoiNmVmNzk2MzgtNTRjMS00MjU0LTkzNWUtMjFhNzliYTMzZTU2IiwiaW5wdXRfZGVzY3JpcHRvcnMiOlt7ImNvbnN0cmFpbnRzIjp7ImZpZWxkcyI6W3sibmFtZSI6IkRlYml0IGNhcmQgbnVtYmVyIiwicGF0aCI6WyIkLmRlYml0Q2FyZE51bWJlciIsIiQudmMuZGViaXRDYXJkTnVtYmVyIl19LHsibmFtZSI6IkRlYml0IGNhcmQgZXhwaXJ5IiwicGF0aCI6WyIkLmRlYml0Q2FyZEV4cGlyeURhdGUiLCIkLnZjLmRlYml0Q2FyZEV4cGlyeURhdGUiXX0seyJuYW1lIjoiRGViaXQgY2FyZCBDVlYiLCJwYXRoIjpbIiQuZGViaXRDYXJkQ1ZWIiwiJC52Yy5kZWJpdENhcmRDVlYiLCIkLnZjLmN2diJdfV19LCJpZCI6IjAiLCJwdXJwb3NlIjoiUHJvdmlkZSBkZWJpdCBjYXJkIGluZm8gc28gUEZJIGNhbiBjaGFyZ2UgVVNEIn0seyJjb25zdHJhaW50cyI6eyJmaWVsZHMiOlt7Im5hbWUiOiJCVEMgQWRkcmVzcyIsInBhdGgiOlsiJC5idGNBZGRyZXNzIiwiJC52Yy5idGNBZGRyZXNzIiwiJC5iaXRjb2luQWRkcmVzcyIsIiQudmMuYml0Y29pbkFkZHJlc3MiXX1dfSwiaWQiOiIxIiwicHVycG9zZSI6IlByb3ZpZGUgYnRjIGFkZHJlc3MgaW5mbyBzbyBQRkkgY2FuIHNlbmQgQlRDIn1dLCJuYW1lIjoiUGF5aW4vUGF5b3V0IGluc3RydW1lbnQgcHJlc2VudGF0aW9uIGRlZmluaXRpb24iLCJwdXJwb3NlIjoiUHJvdmlkZSBwYXltZW50IGluc3RydW1lbnRzIHNvIHdlIGNhbiBkbyBhIGJ1c2luZXNzIHRoaW5nIn19.dRS5UTPDJmLsaO4YVhKH1brA_wUQohU-6BxxvNMMcdQq5BfXYQ64VaRer7tlA7t26AYephpx2zSaQIgEWfNnAw"
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