import { DidIonMethod, DidKeyMethod } from '@web5/dids'

import { Rfq } from './message-kinds/index.js'
import { Offering } from './resource-kinds/index.js'

type DidMethodOptions = 'key' | 'ion'

export class DevTools {
  /**
   * creates and returns a DID
   * @param didMethod - the type of DID to create. defaults to did:key
   */
  static async createDid(didMethod: DidMethodOptions = 'key') {
    if (didMethod === 'key') {
      return DidKeyMethod.create()
    } else if (didMethod === 'ion') {
      return DidIonMethod.create()
    } else {
      throw new Error(`${didMethod} method not implemented.`)
    }
  }

  /**
   * creates and returns an example offering. Useful for testing purposes
   */
  static createOffering() {
    return new Offering({
      description  : 'Selling BTC for USD',
      baseCurrency : {
        currencyCode : 'BTC',
        maxSubunits  : '99952611'
      },
      quoteCurrency: {
        currencyCode: 'USD'
      },
      quoteUnitsPerBaseUnit : '26043.40',
      payinMethods          : [{
        kind                   : 'DEBIT_CARD',
        requiredPaymentDetails : {
          $schema    : 'http://json-schema.org/draft-07/schema',
          type       : 'object',
          properties : {
            cardNumber: {
              type        : 'string',
              description : 'The 16-digit debit card number',
              minLength   : 16,
              maxLength   : 16
            },
            expiryDate: {
              type        : 'string',
              description : 'The expiry date of the card in MM/YY format',
              pattern     : '^(0[1-9]|1[0-2])\\/([0-9]{2})$'
            },
            cardHolderName: {
              type        : 'string',
              description : 'Name of the cardholder as it appears on the card'
            },
            cvv: {
              type        : 'string',
              description : 'The 3-digit CVV code',
              minLength   : 3,
              maxLength   : 3
            }
          },
          required             : ['cardNumber', 'expiryDate', 'cardHolderName', 'cvv'],
          additionalProperties : false
        }
      }],
      payoutMethods: [{
        kind                   : 'BTC_ADDRESS',
        requiredPaymentDetails : {
          $schema    : 'http://json-schema.org/draft-07/schema',
          type       : 'object',
          properties : {
            btcAddress: {
              type        : 'string',
              description : 'your Bitcoin wallet address'
            }
          },
          required             : ['btcAddress'],
          additionalProperties : false
        }
      }],
      vcRequirements: {
        id                : '7ce4004c-3c38-4853-968b-e411bafcd945',
        input_descriptors : [{
          id          : 'bbdb9b7c-5754-4f46-b63b-590bada959e0',
          constraints : {
            fields: [{
              path   : ['$.type'],
              filter : {
                type  : 'string',
                const : 'YoloCredential'
              }
            }]
          }
        }]
      }
    })
  }

  /**
   *
   * creates and returns an example rfq. Useful for testing purposes
   */
  static createRfq() {
    return new Rfq({
      offeringId  : 'abcd123',
      payinMethod : {
        kind           : 'BTC_ADDRESS',
        paymentDetails : {
          address: '0x243234255'
        }
      },
      payoutMethod: {
        kind           : 'MOMO_MPESA',
        paymentDetails : {
          phoneNumber: '0123456789'
        }
      },
      quoteAmountSubunits : '0.0023124',
      vcs                 : ''
    })
  }
}