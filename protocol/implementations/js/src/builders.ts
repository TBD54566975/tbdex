import { MessageType, MessageTypes, Metadata, TbDEXMessage } from './types.js'
import {ulid} from 'ulidx'

// maybe extract this somewhere?
const ID_NAMESPACE = 'tbdex'

function createId(messageType: string): string {
  return `${ID_NAMESPACE}:${messageType}:${ulid()}`
}

export function createMessage<Type extends keyof MessageTypes>(to: string, from: string, body: MessageTypes[Type], messageType: Type,): TbDEXMessage<Type> {
  // TODO could validate that type is Offering or RFQ, since they start chains or are one off (no replies)
  const id = createId(messageType)
  return {
    id          : id,
    contextId   : id,
    createdTime : new Date().toISOString(),
    to          : to,
    from        : from,
    type        : messageType,
    body        : body,
  }
}

export function createMessageFrom<Type extends keyof MessageTypes, LastType extends keyof MessageTypes>(body: MessageTypes[Type], messageType: Type, lastMessage: TbDEXMessage<LastType>): TbDEXMessage<Type> {
  const { to, from, contextId } = lastMessage
  return {
    id          : createId(messageType),
    contextId   : contextId,
    createdTime : new Date().toISOString(),
    to          : to,
    from        : from,
    type        : messageType,
    body        : body,
  }
}


export type CreateMessageOpts<T extends keyof MessageTypes> = Partial<Metadata> & {
  from: string,
  to: string,
  messageType: T,
  body: MessageType<T>,
}

export function createMessage2<T extends keyof MessageTypes>(opts: CreateMessageOpts<T>): TbDEXMessage<T> {
  if (messageType )
  const {to, from, messageType, body} = opts
  const id = opts.id ?? createId(opts.messageType)

  var contextId 
  if( !opts.contextId && messageType in ['rfq', 'offering']) {
    contextId = id
  }
  return {
    id          : opts.id ?? createId(opts.messageType),
    contextId   : opts.contextId ?? ,
    createdTime : new Date().toISOString(),
    type : messageType        ,
    to          ,
    from        ,
    body        ,
  }
  console.log(opts)
}