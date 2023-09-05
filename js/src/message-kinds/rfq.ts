import type { MessageKind, MessageKindModel, MessageMetadata, ResourceModel } from '../types.js'
import { Offering } from '../resource-kinds/index.js'
import { Message } from '../message.js'
import { PEXv2 } from '@sphereon/pex'

const pex = new PEXv2()

/** options passed to {@link Quote.create} */
export type CreateRfqOptions = {
  data: MessageKindModel<'rfq'>
  metadata: Omit<MessageMetadata<'rfq'>, 'id' |'kind' | 'createdAt' | 'exchangeId'>
  private?: Record<string, any>
}

export class Rfq extends Message<'rfq'> {
  /** a set of valid Message kinds that can come after an rfq */
  readonly validNext = new Set<MessageKind>(['quote', 'close'])
  _private: Record<string, any>

  static create(opts: CreateRfqOptions) {
    const id = Message.generateId('rfq')
    const metadata: MessageMetadata<'rfq'> = {
      ...opts.metadata,
      kind       : 'rfq',
      id         : id,
      exchangeId : id,
      createdAt  : new Date().toISOString()
    }

    // TODO: hash `data.payinMethod.paymentDetails` and set `private`
    // TODO: hash `data.payoutMethod.paymentDetails` and set `private`

    const message = { metadata, data: opts.data }
    return new Rfq(message)
  }

  /**
   * evaluates this rfq against the provided offering
   * @param offering - the offering to evaluate this rfq against
   * @throws if {@link offeringId} doesn't match the provided offering's id
   */
  verifyOfferingRequirements(offering: Offering | ResourceModel<'offering'>) {
    if (offering.metadata.id !== this.offeringId)  {
      throw new Error(`offering id mismatch. (rfq) ${this.offeringId} !== ${offering.metadata.id} (offering)`)
    }

    // TODO: validate rfq's quoteAmountSubunits against offering's quoteCurrency min/max

    // TODO: validate rfq's payinMethod.kind against offering's payinMethods
    // TODO: validate rfq's payinMethod.paymentDetails against offering's respective requiredPaymentDetails json schema

    // TODO: validate rfq's payoutMethod.kind against offering's payoutMethods
    // TODO: validate rfq's payoutMethod.paymentDetails against offering's respective requiredPaymentDetails json schema

    this.verifyClaims(offering)
  }

  /**
   * checks the claims provided in this rfq against an offering's requirements
   * @param offering - the offering to check against
   * @throws if rfq's claims do not fulfill the offering's requirements
   */
  verifyClaims(offering: Offering | ResourceModel<'offering'>) {
    const { areRequiredCredentialsPresent } = pex.evaluateCredentials(offering.data.requiredClaims, this.claims)

    if (areRequiredCredentialsPresent === 'error') {
      throw new Error(`claims do not fulfill the offering's requirements`)
    }

    // TODO: verify integrity
  }

  /** Offering which Alice would like to get a quote for */
  get offeringId() {
    return this.data.offeringId
  }

  /** Amount of quote currency you want to spend in order to receive base currency */
  get quoteAmountSubunits() {
    return this.data.quoteAmountSubunits
  }

  /** Presentation Submission VP that fulfills the requirements included in the respective Offering */
  get claims() {
    return this.data.claims
  }

  /** Selected payment method that Alice will use to send the listed quote currency to the PFI. */
  get payinMethod() {
    return this.data.payinMethod
  }

  /** Selected payment method that the PFI will use to send the listed base currency to Alice */
  get payoutMethod() {
    return this.data.payoutMethod
  }

  toJSON() {
    const jsonMessage = super.toJSON()
    jsonMessage['private'] = this._private

    return jsonMessage
  }
}