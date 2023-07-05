import { MessageType, MessageTypes, TbDEXMessage, XOR } from './types.js'
import { createTbdexId } from './id.js'

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
  const id = createTbdexId(opts.type)
  const threadId = opts.last?.threadId ?? id
  const parentId = opts.last?.id ?? null
  const {type, body} = opts

  return {
    id,
    threadId,
    parentId,
    createdTime : new Date().toISOString(),
    type,
    body,
    to          : opts.to ?? opts.last.to,
    from        : opts.from ?? opts.last.from,
  }
}