import { typeid } from 'typeid-js'
import { MessageType, MessageTypes, Metadata, TbdexMessage } from './message-types.js'
import { Schema } from 'ajv'

// checks if payment details conforms to requiredPaymentDetails schema from offering
// throws validation error if fails
export function validatePaymentDetails(paymentDetails: Object, expectedDetails: Schema) { }

// does same thing as above, but for presentation submission (could combine into one func)
export function validateVcs(vcs: Object, expected: Schema) {}

// takes raw payment details and returns a hash of the object
export function hashSecret(paymentDetails: Object): string { 
  return "hashed-secret"
}

export function createSignature(did: string, metadata: Metadata, data: Object): string {
  return "sig-string"
}

export type MetadataOpts<T extends keyof MessageTypes> = Omit<Metadata<T>, "id" | "createdAt">

export function createMetadata(metadataOpts: MetadataOpts): Metadata {
  const id = typeid(metadataOpts.kind)

  const metadata: Metadata<T> = {
    id,
    createdAt: new Date().toISOString(),
    ...metadataOpts,
  }

  return metadata
}