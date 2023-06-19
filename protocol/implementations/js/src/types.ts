export namespace TbDex {
  export type Offering = {
    placeholder: string;
  }

  export type RFQ = {
    test: string;
  }

  export type Quote = {
    placeholder: string;
  }

  export type MessageTypes = {
    rfq: RFQ,
    quote: Quote
  }

  export type MessageType<M extends keyof MessageTypes> = MessageTypes[M];

  export type Message<T extends keyof MessageTypes> = {
    id: string;
    contextId: string;
    from: string;
    to: string;
    type: T;
    body: MessageTypes[T];
    createdTime: number;
  }

  export function createWrapper(id: string, contextId: string, to: string, from: string) {
    return {
      createdTime: Date.now(),
      id: id,
      contextId: contextId,
      from: from,
      to: to,
    }
  }

  export function wrapperFrom(message: Message<>, id: string) {
    const {to, from, contextId} = message
    return {
      createdTime: Date.now(),
      id: id,
      to,
      from,
      contextId
    }
  }

  export function createRfqMessage(rfq: RFQ): Message<"rfq"> {
    return {
      type: "rfq",
      body: rfq,
      ...createWrapper()
    }
  }

  export function createQuoteMessage(quote: Quote): Message<"quote"> {
    return {
      type: "rfq",
      body: rfq,
      ...wrapperFrom()
    }
  }
}


