export const aliceProtocolDefinition = {
  protocol : 'https://tbd.website/protocols/tbdex',
  types    : {
    RFQ: {
      schema      : 'https://tbd.website/protocols/tbdex/RequestForQuote',
      dataFormats : [
        'application/json'
      ]
    },
    QuoteResponse: {
      schema      : 'https://tbd.website/protocols/tbdex/QuoteResponse',
      dataFormats : [
        'application/json'
      ]
    },
    OrderStatus: {
      schema      : 'https://tbd.website/protocols/tbdex/OrderStatus',
      dataFormats : [
        'application/json'
      ]
    }
  },
  structure: {
    // alice sends RFQs, not receives them
    RFQ: {
      // whoever received the RFQ that Alice sent, can write back a QuoteResponse to Alice
      QuoteResponse: {
        $actions: [
          {
            who : 'recipient',
            of  : 'RFQ',
            can : 'write'
          }
        ],
        // OrderStatus can be written to Alice's DWN by someone who wrote RFQ/QuoteResponse (i.e. PFI)
        OrderStatus: {
          $actions: [
            {
              who : 'author',
              of  : 'RFQ/QuoteResponse',
              can : 'write'
            }
          ]
        }
      }
    }
  }
}


export const pfiProtocolDefinition = {
  protocol : 'https://tbd.website/protocols/tbdex',
  types    : {
    RFQ: {
      schema      : 'https://tbd.website/protocols/tbdex/RequestForQuote',
      dataFormats : [
        'application/json'
      ]
    },
    QuoteResponse: {
      schema      : 'https://tbd.website/protocols/tbdex/QuoteResponse',
      dataFormats : [
        'application/json'
      ]
    },
    OrderStatus: {
      schema      : 'https://tbd.website/protocols/tbdex/OrderStatus',
      dataFormats : [
        'application/json'
      ]
    }
  },
  structure: {
    // anyone can write RFQ to a PFIs DWN
    // no one can read RFQs from PFIs DWN (except the PFI itself)
    RFQ: {
      $actions: [
        {
          who : 'anyone',
          can : 'write'
        }
      ],
      // PFI is sending OUT quote responses. no one should be writing QuoteResponse to PFIs.
      QuoteResponse: {
        // PFI is sending OUT OrderStatus. no one should be writing OrderStatus to PFIs.
        OrderStatus: { }
      }
    }
  }
}
