import { MessageType, MessageTypes, TbDEXMessage, XOR } from './types.js'
import { typeid } from 'typeid-js'

type NewThreadOpts = {
  from: string,
  to: string,
}

type ReplyMessageOpts<T extends keyof MessageTypes> = {
  reply: TbDEXMessage<T>
}

export type CreateMessageOpts<T extends keyof MessageTypes, U extends keyof MessageTypes> = {
  to: string,
  from: string,
  type: T,
  body: MessageType<T>,
  last?: TbDEXMessage<U>
}

export function createMessageDumb<T extends keyof MessageTypes, U extends keyof MessageTypes>(opts: CreateMessageOpts<T, U>): TbDEXMessage<T> {
  const id = typeid(opts.type)
  const threadId = opts.last?.threadId ?? id.toString()
  const parentId = opts.last?.id.toString() ?? undefined
  const {type, body} = opts

  return {
    id,
    threadId,
    parentId,
    to          : opts.to,
    from        : opts.from,
    createdTime : new Date().toISOString(),
    type,
    body,
  }
}

type LastMessageOpts<T extends keyof MessageTypes> = {
last: TbDEXMessage<T>
}

export type CreateMessageSmartOpts<T extends keyof MessageTypes, U extends keyof MessageTypes> = XOR<NewThreadOpts, LastMessageOpts<U>> & {
  type: T,
  body: MessageType<T>
}

export function createMessageSmart<T extends keyof MessageTypes, U extends keyof MessageTypes>(opts: CreateMessageSmartOpts<T, U>): TbDEXMessage<T> {
  const id = typeid(opts.type)
  const threadId = opts.last?.threadId ?? id.toString()
  const parentId = opts.last?.id.toString() ?? undefined
  const {type, body} = opts

  let from: string
  let to: string
  switch (opts.type) {
  case 'close':
    from = opts.from
    to = opts.to
    break
  case 'orderstatus':
    from = opts.last.from
    to = opts.last.to
    break
  case 'quote':
    from = opts.last.to
    to = opts.last.from
    break
  case 'rfq':
    from = opts.from
    to = opts.to
    break
  }

  return {
    id,
    threadId,
    parentId,
    from,
    to,
    createdTime: new Date().toISOString(),
    type,
    body,
  }
}

export type CreateMessageOpts2<T extends keyof MessageTypes, U extends keyof MessageTypes, X extends keyof MessageTypes> =
XOR<NewThreadOpts, ReplyMessageOpts<U>> & {
  type: T,
  body: MessageType<T>,
  last?: TbDEXMessage<X>
}

export function createMessage2<T extends keyof MessageTypes, U extends keyof MessageTypes, X extends keyof MessageTypes>(opts: CreateMessageOpts2<T, U, X>): TbDEXMessage<T> {
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