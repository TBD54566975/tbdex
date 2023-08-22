import { typeid } from "typeid-js"
import { MessageKind, MessageMetadata, MessageSignature, Offering, Rfq as RfqType, Order as OrderType, Quote as QuoteType, Close as CloseType, OrderStatus as OrderStatusType, PaymentInstructions, QuoteDetails } from "./types.js"

type RfqOpts = {
    /** Offering which Alice would like to get a quote for */
    offeringId: string
    /** Amount of quote currency you want to spend in order to receive base currency */
    quoteAmountSubunits: string
    /** JWS of Presentation Submission that fulfills the requirements included in the respective Offering */
    vcJws: string
    /** Selected payment method that Alice will use to send the listed quote currency to the PFI. */
    payinMethod: {
        kind: string
        paymentDetails: {}
    }

    /** Selected payment method that the PFI will use to send the listed base currency to Alice */
    payoutMethod: {
        kind: string
        paymentDetails: {}
    }
}

class Rfq {
    readonly validNext = new Set<string>(['quote', 'close'])
    readonly kind: MessageKind = 'rfq'

    offeringId: string
    quoteAmountSubunits: string
    vcJws: string
    payinMethod: {
        kind: string
        paymentDetails: {}
        paymentDetailsJws: string
    }
    payoutMethod: {
        kind: string
        paymentDetails: {}
        paymentDetailsJws: string
    }

    constructor(rfqOpts: RfqOpts) {
        this.offeringId = rfqOpts.offeringId
        this.quoteAmountSubunits = rfqOpts.quoteAmountSubunits
        // Should we also support passing in a presentation submission and forming the JWS for the caller?
        this.vcJws = rfqOpts.vcJws
        this.payinMethod = {
            paymentDetailsJws: this.hash(rfqOpts.payinMethod.paymentDetails),
            ...rfqOpts.payinMethod
        }
        this.payoutMethod = {
            paymentDetailsJws: this.hash(rfqOpts.payoutMethod.paymentDetails),
            ...rfqOpts.payoutMethod
        }
    }

    private hash(objToHash: {}): string {
        return 'hashedpii'
    }
}

class Quote {
    readonly validNext = new Set<string>(['order', 'close'])
    readonly kind: MessageKind = 'quote'

    expiresAt: string
    /** the amount of base currency that Alice will receive */
    base: QuoteDetails
    /** the amount of quote currency that the PFI will receive */
    quote: QuoteDetails
    /** Object that describes how to pay the PFI, and how to get paid by the PFI (e.g. BTC address, payment link) */
    paymentInstructions: PaymentInstructions

    constructor(quoteOpts: QuoteType) {
        this.expiresAt = quoteOpts.expiresAt
        this.base = quoteOpts.base
        this.quote = quoteOpts.quote
        this.paymentInstructions = quoteOpts.paymentInstructions
    }
}

class Close {
    readonly validNext = new Set<string>()
    readonly kind: MessageKind = 'close'

    reason?: string

    constructor(closeOpts: CloseType) {
        this.reason = closeOpts.reason
    }
}

class Order {
    readonly validNext = new Set<string>(['orderStatus'])
    readonly kind: MessageKind = 'order'
}

class OrderStatus {
    readonly validNext = new Set<string>(['orderStatus'])
    readonly kind: MessageKind = 'orderStatus'

    status?: string

    constructor(orderStatusOpts: OrderStatusType) {
        this.status = orderStatusOpts.orderStatus
    }
}

type MessageOpts = {
    metadata: Omit<MessageMetadata, 'id' | 'kind' | 'createdAt'>, // what about exchange id, should be generated for rfq but passed in for subsequent
    data: Rfq | Quote | Close | Order | OrderStatus
}
class Message {
    metadata: MessageMetadata
    data: Rfq | Quote | Close | Order | OrderStatus
    private: Record<string, any>
    signature: MessageSignature

    constructor(messageOpts: MessageOpts) {
        const kind = messageOpts.data.kind
        const id = typeid(kind).toString()

        this.metadata = {
            exchangeId: id,
            createdAt: new Date().toISOString(),
            id,
            kind,
            ...messageOpts.metadata
        }

        this.data = messageOpts.data

        // this feels a bit clunky to move to private and then delete from data?
        if (this.data instanceof Rfq) {
            this.private = {
                payinMethod: { paymentDetails: this.data.payinMethod.paymentDetails },
                payoutMethod: { paymentDetails: this.data.payoutMethod.paymentDetails }
            }
            delete this.data.payinMethod.paymentDetails
            delete this.data.payoutMethod.paymentDetails
        }
    }

    get createdAt(): Date {
        return new Date(this.metadata.createdAt)
    }

    /**
     * sign uses the `from` DID to sign the message data and metadata 
     */
    sign(): void {
        this.signature = this.hashMe()
    }

    /**
     * json string -> message object 
     */
    static fromString(messageString: string) {
        // TODO: validate against json schema
        const object = JSON.parse(messageString)
    }

    private hashMe(): string {
        return 'hashOf(this.data, this.metadata, this.metadata.from)'
    }
}

/**
 * validateExchange takes all of the messages in an exchange and validates
 * whether the order of messages is valid. Throws an error if invalid. 
 */
function validateExchange(messages: Message[]) {
    messages.sort((a, b) => a.createdAt.getUTCMilliseconds() - b.createdAt.getUTCMilliseconds())
    if (messages[0].data.kind != 'rfq') throw Error('exchange must start with rfq')

    for (let i = 1; i < messages.length - 2; i++) {
        const allowedKinds = messages[i].data.validNext
        const actualKind = messages[i + 1].data.kind
        if (!(actualKind in allowedKinds)) {
            // TODO: print out the allowed and actual kinds
            throw Error('invalid message order')
        }
    }
}

/**
 * checks whether an Rfq is valid for a given Offering:
 * - amounts within Offering's min/max thresholds
 * - required payment details are present
 * - vcs satisfy requirements 
 */
function isRfqValidForOffering(rfq: Rfq, offering: Offering) {

}
