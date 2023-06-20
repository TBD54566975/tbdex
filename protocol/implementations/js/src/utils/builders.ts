import { TbDex } from '../types'

type Metadata = {
    createdTime: string,
    to: string,
    from: string,
    contextId: string
}

/**
 * The rfq is the first in the message chain, so it sets the contextId with its own id rather than deriving from the last message
 */
export function createRfqMessage(id: string, to: string, from: string, rfq: TbDex.RFQ): TbDex.Message<"rfq"> {
    return {
        id: id,
        type: "rfq",
        body: rfq,
        createdTime: new Date().toISOString(),
        contextId: id,
        from: from,
        to: to,
    }
}

export function wrapperFrom<MessageType extends keyof TbDex.MessageTypes>(message: TbDex.Message<MessageType>): Metadata {
    // TODO probably a nicer way to write this?
    const { to, from, contextId } = message
    return {
        createdTime: new Date().toISOString(),
        to: to,
        from: from,
        contextId: contextId
    }
}

export function createQuoteMessage(id: string, quote: TbDex.Quote, last: TbDex.Message<"rfq">): TbDex.Message<"quote"> {
    return {
        id: id,
        type: "quote",
        body: quote,
        ...wrapperFrom(last)
    }
}

// attempt to make a generic version, issue around converting type to a string to use in the return object
// export function createMessage<MessageType extends keyof TbDex.MessageTypes, LastType extends keyof TbDex.MessageTypes>(id: string, body: MessageType, last: TbDex.Message<LastType>): TbDex.Message<MessageType> {
//     const metadata = last ? wrapperFrom(last) : {
//         createdTime: new Date().toISOString(),
//         contextId: id,
//         from: "from-did",
//         to: "to-did"
//      }
//     return {
//         id: id,
//         type: "rfq",
//         body: body,
//         ...metadata
//     }
// }