const CloseRules = {
  $actions: [
    {
      who : 'recipient',
      of  : 'RFQ',
      can : 'write'
    },
    {
      who : 'author',
      of  : 'RFQ',
      can : 'write'
    },
  ],
}

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
    Close: {
      schema      : 'https://tbd.website/protocols/tbdex/Close',
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
        // Alice _or_ the PFI can Close/End the thread here.
        Close       : CloseRules,
        // OrderStatus can be written to Alice's DWN by someone who wrote RFQ/QuoteResponse (i.e. PFI)
        OrderStatus : {
          $actions: [
            {
              who : 'author',
              of  : 'RFQ/Quote',
              can : 'write'
            }
          ]
        }
      },
      // Alice _or_ the PFI can Close/End the thread here.
      Close: CloseRules
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
    Close: {
      schema      : 'https://tbd.website/protocols/tbdex/Close',
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
      // Alice _or_ the PFI can Close/End the thread here.
      Close : CloseRules,
      // PFI is sending OUT quote responses. no one should be writing QuoteResponse to PFIs.
      Quote : {
        // PFI is sending OUT OrderStatus. no one should be writing OrderStatus to PFIs.
        OrderStatus : { },
        // Alice _or_ the PFI can Close/End the thread here.
        Close       : CloseRules
      }
    }
  }
}