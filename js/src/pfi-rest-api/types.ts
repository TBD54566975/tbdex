import type { MessageKindClass, Message } from '../message.js'
import type { ResourceKindClass, Resource } from '../resource.js'

export type ErrorDetail = {
  /** A unique identifier for this particular occurrence of the problem. */
  id?: string
  /** The HTTP status code applicable to this problem, expressed as a string value. */
  status?: string
  /** An application-specific error code, expressed as a string value. */
  code?: string
  /** A short, human-readable summary of the problem. */
  title?: string
  /** A human-readable explanation specific to this occurrence of the problem. */
  detail?: string
  /** An object containing references to the source of the error. */
  source?: {
    /** A JSON Pointer to the value in the request document that caused the error. */
    pointer?: string
    /** A string indicating which URI query parameter caused the error. */
    parameter?: string
    /** A string indicating the name of a single request header which caused the error. */
    header?: string
  }
  /** A meta object containing non-standard meta-information about the error. */
  meta?: Record<string, any>
}

export type HttpResponse = {
  status: number
  headers: Headers
}

export type DataResponse<T extends Message<MessageKindClass>[] | Resource<ResourceKindClass>[]> = HttpResponse & {
  data: T
  errors?: never
}

export type ErrorResponse = HttpResponse & {
  data?: never
  errors: ErrorDetail[]
}
