/**
 * Pre-compiles Ajv validators from json schemas
 * Ajv supports generating standalone validation functions from JSON Schemas at compile/build time.
 * These functions can then be used during runtime to do validation without initializing Ajv.
 * This is useful for several reasons:
 * - to avoid dynamic code evaluation with Function constructor (used for schema compilation) -
 *   when it is prohibited by the browser page [Content Security Policy](https://ajv.js.org/security.html#content-security-policy).
 * - to reduce the browser bundle size - Ajv is not included in the bundle
 * - to reduce the start-up time - the validation and compilation of schemas will happen during build time.
 */

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

import Ajv from 'ajv'
import { mkdirp } from 'mkdirp'
import standaloneCode from 'ajv/dist/standalone/index.js'

import definitions from '../../json-schemas/definitions.json' assert { type: 'json' }
import resource from '../../json-schemas/resource.schema.json' assert { type: 'json' }
import offering from '../../json-schemas/offering.schema.json' assert { type: 'json' }
import message from '../../json-schemas/message.schema.json' assert { type: 'json' }
import rfq from '../../json-schemas/rfq.schema.json' assert { type: 'json' }
import quote from '../../json-schemas/quote.schema.json' assert { type: 'json' }
import order from '../../json-schemas/order.schema.json' assert { type: 'json' }
import orderStatus from '../../json-schemas/order-status.schema.json' assert { type: 'json' }
import close from '../../json-schemas/close.schema.json' assert { type: 'json' }

const schemas = {
  definitions,
  resource,
  offering,
  message,
  rfq,
  quote,
  order,
  orderStatus,
  close,
}

const validator = new Ajv({ code: { source: true, esm: true } })

for (const schemaName in schemas) {
  validator.addSchema(schemas[schemaName], schemaName)
}

const moduleCode = standaloneCode(validator)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

await mkdirp(path.join(__dirname, '../generated'))
fs.writeFileSync(path.join(__dirname, '../generated/compiled-validators.js'), moduleCode)