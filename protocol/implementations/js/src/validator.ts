import * as precompiledValidators from '../generated/precompiled-validators.js'

export function validateMessage(payload: any): void {
  let validateFn = (precompiledValidators as any)['tbdexMessage']
  validateFn(payload)

  if (validateFn.errors) {
    // TODO modify default, return all errors
    // AJV is configured by default to stop validating after the 1st error is encountered which means
    // there will only ever be one error;
    const [errorObj] = validateFn.errors
    let { instancePath, message } = errorObj

    throw new SchemaValidationError(`${instancePath ?? 'tbDEXMessage'}: ${message}`)
  }

  validateFn = (precompiledValidators as any)[payload['type']]
  validateFn(payload['body'])

  if (validateFn.errors) {
    // TODO modify default, return all errors
    // AJV is configured by default to stop validating after the 1st error is encountered which means
    // there will only ever be one error;
    const [errorObj] = validateFn.errors
    const { instancePath, message } = errorObj

    throw new SchemaValidationError(`${instancePath ?? 'tbDEXMessage'}: ${message}`)
  }


}

export class SchemaValidationError extends Error { }