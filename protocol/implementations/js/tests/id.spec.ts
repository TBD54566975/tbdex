import { expect } from 'chai'
import { createTbdexId } from '../src/id.js'

describe('id builder', () => {
  it('builds expected id for message types', () => {
    expect(createTbdexId('orderStatus').startsWith('tbdex:orderStatus')).to.be.true
  })
  it('builds expected id for resource types', () => {
    expect(createTbdexId('offering').startsWith('tbdex:offering')).to.be.true
  })
})