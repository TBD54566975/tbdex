import { MessageType, MessageTypes, TbDEXMessage } from './types.js'
import {ulid} from 'ulidx'

/**
 * Get the keys of T without any keys of U.
 */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

/**
 * Restrict using either only the keys of T or only the keys of U.
 */
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

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
  const id = createId(opts.type)
  const contextId = opts.last?.contextId ?? id
  const {type, body} = opts

  return {
    id,
    contextId,
    createdTime : new Date().toISOString(),
    type,
    body,
    to          : opts.to ?? opts.last.to,
    from        : opts.from ?? opts.last.from,
  }
}

// maybe extract this somewhere?
const ID_NAMESPACE = 'tbdex'

function createId<T extends keyof MessageTypes>(messageType: T): string {
  return `${ID_NAMESPACE}:${messageType}:${ulid()}`
}