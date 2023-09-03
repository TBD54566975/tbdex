import type { MessageKind, MessageModel, NewMessage, ResourceKind, ResourceModel, NewResource } from './types.js'
import type { ResourceKindClass } from './resource-kinds/index.js'
import type { MessageKindClass } from './message-kinds/index.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Resource } from './resource.js'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Message } from './message.js'

import { Rfq, Quote, Order, OrderStatus, Close } from './message-kinds/index.js'
import { Offering } from './resource-kinds/index.js'

/**
 * parses a json message into an instance of message kind's class
 * Note: This really should be a part of {@link Message.parse} but can't be because it creates a circular dependency
 * due to each concrete MessageKind class extending Message
 * @param jsonMessage - the message to parse
 */
export function messageFactory<T extends MessageKind>(jsonMessage: MessageModel<T>): MessageKindClass {
  switch(jsonMessage.metadata.kind) {
    case 'rfq': return new Rfq(jsonMessage as NewMessage<'rfq'>)
    case 'quote': return new Quote(jsonMessage as NewMessage<'quote'>)
    case 'order': return new Order(jsonMessage as NewMessage<'order'>)
    case 'orderstatus': return new OrderStatus(jsonMessage as NewMessage<'orderstatus'>)
    case 'close': return new Close(jsonMessage as NewMessage<'close'>)
  }
}

/**
 * parses a json message into an instance of message kind's class
 * Note: This really should be a part of {@link Resource.parse} but can't be because it creates a circular dependency
 * due to each concrete MessageKind class extending Message
 * @param jsonResource - the resource to parse
 * @returns
 */
export function resourceFactory<T extends ResourceKind>(jsonResource: ResourceModel<T>): ResourceKindClass {
  switch(jsonResource.metadata.kind) {
    case 'offering': return new Offering(jsonResource as NewResource<'offering'>)
  }
}