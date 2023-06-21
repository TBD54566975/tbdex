import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import tbdexMessage from '../../json-schemas/tbdex-message.schema.json' assert { type: 'json' };

const validator = new Ajv.default();
addFormats.default(validator);
validator.addSchema(tbdexMessage, 'tbdex-message');

export const SchemaName = 'tbdex-message';

export function validateMessage(payload: any): void {
    const validateFn = validator.getSchema(SchemaName);

    if (!validateFn) {
        throw new Error(`schema for ${SchemaName} not found.`);
    }

    validateFn(payload);

    if (!validateFn.errors) {
        return;
    }

    // AJV is configured by default to stop validating after the 1st error is encountered which means
    // there will only ever be one error;
    const [errorObj] = validateFn.errors;
    let { instancePath, message } = errorObj;

    throw new SchemaValidationError(`${instancePath ?? SchemaName}: ${message}`);
}

export class SchemaValidationError extends Error {}