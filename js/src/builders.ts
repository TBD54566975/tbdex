import { MessageType, MessageTypes, TbDEXMessage, XOR } from './types.js'
import { typeid } from 'typeid-js'

type NewThreadOpts = {
  from: string,
  to: string,
}

type LastMessageOpts<T extends keyof MessageTypes> = {
  last: TbDEXMessage<T>
}

type ReplyMessageOpts<T extends keyof MessageTypes> = {
  reply: TbDEXMessage<T>
}

export type CreateMessageOpts<T extends keyof MessageTypes, U extends keyof MessageTypes> = XOR<NewThreadOpts, LastMessageOpts<U>> & {
  type: T,
  body: MessageType<T>,
}

export type CreateMessageOpts2<T extends keyof MessageTypes, U extends keyof MessageTypes, X extends keyof MessageTypes> =
XOR<NewThreadOpts, ReplyMessageOpts<U>> & {
  type: T,
  body: MessageType<T>,
  last?: TbDEXMessage<X>
}

export function createMessage<T extends keyof MessageTypes, U extends keyof MessageTypes, X extends keyof MessageTypes>(opts: CreateMessageOpts2<T, U, X>): TbDEXMessage<T> {
  const id = typeid(opts.type)
  const threadId = opts.last?.threadId ?? id.toString()
  const parentId = opts.last?.id.toString() ?? undefined
  const {type, body} = opts

  return {
    id,
    threadId,
    parentId,
    to          : opts.reply.from ?? opts.to,
    from        : opts.reply.to ?? opts.from,
    createdTime : new Date().toISOString(),
    type,
    body,
  }
}