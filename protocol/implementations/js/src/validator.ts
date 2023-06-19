import Ajv from 'ajv';

import JsonRpcRequest from '../../../json-schemas/tbdex-message-schema.json' assert { type: 'json' };

const validator = new Ajv.default();
validator.addSchema(JsonRpcRequest, 'jsonrpc-request');
validator.addSchema(dwnRequest, 'dwn-request');

export type SchemaNames = 'jsonrpc-request' | 'dwn-request';