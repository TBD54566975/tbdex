import { ulid } from 'ulidx'
import { MessageTypes, ResourceTypes } from './types.js'

const ID_NAMESPACE = 'tbdex'
// TODO add function for validating an existing string and returning strongly typed id

// TODO support strongly typed id per type e.g TbdexId<Offering>
export function createTbdexId<T extends keyof MessageTypes | keyof ResourceTypes>(typeNamespace: T): string {
  return `${ID_NAMESPACE}:${typeNamespace}:${ulid()}`
}
