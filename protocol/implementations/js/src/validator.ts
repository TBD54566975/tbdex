import Ajv from 'ajv'
import addFormats from 'ajv-formats'

import tbdexMessage from '../../json-schemas/tbdex-message.schema.json' assert { type: 'json' }

const validator = new Ajv.default({ allErrors: true })
addFormats.default(validator)
validator.addSchema(tbdexMessage, 'tbdex-message')

export const SchemaName = 'tbdex-message'

export function validateMessage(payload: any): void {
  const validateFn = validator.getSchema(SchemaName)

  if (!validateFn) {
    throw new Error(`schema for ${SchemaName} not found.`)
  }

  validateFn(payload)

  if (!validateFn.errors) {
    return
  }

  const errorMessages = []
  for (let error of validateFn.errors) {
    const errorMessage = `${error.instancePath ?? SchemaName}: ${error.message}`
    errorMessages.push(errorMessage)
  }

  throw new SchemaValidationError(errorMessages.join(', '))
}

export class SchemaValidationError extends Error { }