import fs from 'node:fs'
import path from 'path'
import Ajv from 'ajv'

import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const vectorsDir = `${__dirname}/../../hosted/test-vectors`

let vectorsSchemaResp = await fetch('https://tbd54566975.github.io/sdk-development/web5-test-vectors/vectors.schema.json')
let vectorsSchema = await vectorsSchemaResp.text()
vectorsSchema = JSON.parse(vectorsSchema)

const ajv = new Ajv()
const validate = ajv.compile(vectorsSchema)

function validateTestVectors() {
  const entries = fs.readdirSync(vectorsDir, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }

    const featureDir = path.join(vectorsDir, entry.name)
    const files = fs.readdirSync(featureDir)

    for (const file of files) {
      if (path.extname(file) === '.json') {
        const filePath = path.join(featureDir, file)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const testData = JSON.parse(fileContent)

        if (!validate(testData)) {
          console.log(`Validation failed for ${filePath}:`, validate.errors)
          process.exit(1)
        } else {
          console.log(`Validation passed for ${filePath}`)
        }
      }
    }
  }
}

validateTestVectors()