export const aliceProtocolDefinition = {
  protocol : 'https://tbd.website/protocols/tbdex',
  types    : {
    RFQ: {
      schema      : 'https://tbd.website/protocols/tbdex/RequestForQuote',
      dataFormats : [
        'application/json'
      ]
    },
    Quote: {
      schema      : 'https://tbd.website/protocols/tbdex/Quote',
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
      // whoever received the RFQ that Alice sent, can write back a Quote to Alice
      Quote: {
        $actions: [
          {
            who : 'recipient',
            of  : 'RFQ',
            can : 'write'
          }
        ],
        // alice sends Orders, not receives them
        OrderStatus: {
          $actions: [
            {
              who : 'recipient',
              of  : 'RFQ/Quote',
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
    Quote: {
      schema      : 'https://tbd.website/protocols/tbdex/Quote',
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
      // PFI is sending OUT quotes. no one should be writing Quotes to PFIs.
      Quote: {
        // PFI is sending OUT OrderStatus. no one should be writing OrderStatus to PFIs.
        OrderStatus: {
        }
      }
    }
  }
}
