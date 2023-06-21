/**
 * The rfq is the first in the message chain, so it sets the contextId with its own id rather than deriving from the last message
 */
export function createRfqMessage(id, to, from, rfq) {
    return {
        id: id,
        type: "rfq",
        body: rfq,
        createdTime: new Date().toISOString(),
        contextId: id,
        from: from,
        to: to,
    };
}
export function wrapperFrom(message) {
    // TODO probably a nicer way to write this?
    const { to, from, contextId } = message;
    return {
        createdTime: new Date().toISOString(),
        to: to,
        from: from,
        contextId: contextId
    };
}
export function createQuoteMessage(id, quote, last) {
    return Object.assign({ id: id, type: "quote", body: quote }, wrapperFrom(last));
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
