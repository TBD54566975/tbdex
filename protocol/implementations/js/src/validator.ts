import type { ErrorObject } from 'ajv'
// validator functions are compiled at build time. check ./build/compile-validators.js for more details
import * as compiledValidators from '../generated/compiled-validators.js'

/**
 * 2-phased validation. validates the outer message first and then validates the body based on the value of `payload.type`
 * @param payload - the payload to validate
 */
export function validateMessage(payload: any): void {
  let validateFn = (compiledValidators as any)['tbdexMessage']
  validateFn(payload)

  if (validateFn.errors) {
    handleValidationError(validateFn.errors)
  }

  // select the appropriate validator based on the value of `payload.type`
  validateFn = (compiledValidators as any)[payload['type']]
  validateFn(payload['body'])

  if (validateFn.errors) {
    handleValidationError(validateFn.errors)
  }
}

function handleValidationError(errors: ErrorObject[]) {
  // TODO modify default, return all errors
  // AJV is configured by default to stop validating after the 1st error is encountered which means
  // there will only ever be one error;
  const [errorObj]: ErrorObject[] = errors
  let { instancePath, message, params } = errorObj

  instancePath ||= 'tbDEXMessage'

  // if an error occurs for a property with an enum type, the default error is "must have one of the allowed types."
  // which is... unhelpful. `params.allowedValues` includes the allowed values. add this to the message if it exists
  message = params.allowedValues ? `${message} - ${params.allowedValues.join(', ')}` : message

  throw new SchemaValidationError(`${instancePath}: ${message}`)
}

export class SchemaValidationError extends Error { }