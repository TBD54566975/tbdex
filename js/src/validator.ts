import type { ErrorObject } from 'ajv'
// validator functions are compiled at build time. check ./build/compile-validators.js for more details
import * as compiledValidators from '../generated/compiled-validators.js'

/**
 * validates the payload against a json schema identified by name
 * @param payload - the payload to validate
 */
export function validate(payload: any, schemaName: string): void {
  let validateFn = (compiledValidators as any)[schemaName]

  if (!validateFn) {
    throw new Error(`no validator found for ${schemaName}`)
  }

  validateFn(payload)

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

  instancePath ||= 'message'

  // if an error occurs for a property with an enum type, the default error is "must have one of the allowed types."
  // which is... unhelpful. `params.allowedValues` includes the allowed values. add this to the message if it exists
  message = params.allowedValues ? `${message} - ${params.allowedValues.join(', ')}` : message

  throw new Error(`${instancePath}: ${message}`)
}