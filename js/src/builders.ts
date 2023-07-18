import { MessageType, MessageTypes, TbDEXMessage, XOR } from './types.js'
import { typeid, type TypeID } from 'typeid-js'

type NewThreadOpts = {
  from: string,
  to: string,
}

type LastMessageOpts<T extends keyof MessageTypes> = {
  last: TbDEXMessage<T>
}

export type CreateMessageOpts<T extends keyof MessageTypes, U extends keyof MessageTypes> = XOR<NewThreadOpts, LastMessageOpts<U>> & {
  type: T,
  body: MessageType<T>,
}

export function createMessage<T extends keyof MessageTypes, U extends keyof MessageTypes>(opts: CreateMessageOpts<T, U>): TbDEXMessage<T> {
  const id = typeid(opts.type)
  const threadId = opts.last?.threadId ?? id.toString()
  const parentId = opts.last?.id.toString() ?? undefined
  const {type, body} = opts

  return {
    id,
    threadId,
    parentId,
    to          : opts.from ?? opts.last.from,
    from        : opts.to ?? opts.last.to,
    createdTime : new Date().toISOString(),
    type,
    body,
  }
}