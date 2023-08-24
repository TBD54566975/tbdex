import { expect } from 'chai'
import { Message } from '../src/main.js'

describe('Message', () => {
  describe('create', () => {
    xit('needs tests')
  })

  describe('parse', () => {
    xit('needs tests')
  })

  describe('validate', () => {
    it('throws an error if payload is not an object or cannot be parsed into an object', () => {
      try {
        Message.validate('hi')
        expect.fail()
      } catch(e) {
        expect(e.message).to.include('must be object')
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