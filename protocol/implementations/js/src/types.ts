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
    dateCreated: string;
  }
}


