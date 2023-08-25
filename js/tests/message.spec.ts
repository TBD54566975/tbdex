import { expect } from 'chai'
import { Message, Rfq } from '../src/main.js'

describe('Message', () => {
  describe('create', () => {
    xit('needs tests')
  })

  describe('parse', () => {
    it('throws an error if payload is not valid JSON', () => {
      try {
        Message.parse(';;;)_')
        expect.fail()
      } catch(e) {
        expect(e.message).to.include('not valid JSON')
      }
    })

    it('returns an instance of Message if parsing is successful', () => {
      const rfq = new Rfq({
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

      const message = Message.create({
        data     : rfq,
        metadata : {
          from : 'did:ex:alice',
          to   : 'did:ex:pfi'
        },
      })

      console.log(JSON.stringify(message, null, 2))
    })
  })

  describe('validate', () => {
    it('throws an error if payload is not an object', () => {
      const testCases = ['hi', [], 30, ';;;)_', true, null, undefined]
      for (let testCase of testCases) {
        try {
          Message.validate(testCase)
          expect.fail()
        } catch(e) {
          expect(e.message).to.include('must be object')
        }
      }
    })

    it('throws an error if required properties are missing', () => {
      try {
        Message.validate({})
        expect.fail()
      } catch(e) {
        expect(e.message).to.include('required property')
      }
    })
  })

  describe('verify', () => {
    xit('needs tests')
  })

  describe('sign', () => {
    xit('needs tests')
  })
})