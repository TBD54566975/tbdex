const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const testVectorsDirectoryPath = path.join(__dirname, 'vectors');
const schemaFilePath = path.join(__dirname, 'vector.schema.json');

function readJsonFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading JSON file at ${filePath}: ${error.message}`);
        return null;
    }
}

function validateTestVectors() {
  // Load the JSON schema
  const schema = readJsonFile(schemaFilePath);

  if (!schema) {
      console.error('Unable to load JSON schema. Exiting.');
      process.exit(1);
  }

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  // Read and validate JSON schema of each test vector file
  const success = true
  fs.readdirSync(testVectorsDirectoryPath)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(testVectorsDirectoryPath, file))
    .map(filePath => {
      const testVectorJson = readJsonFile(filePath)
      if (!testVectorJson || !validate(testVectorJson)) {
        console.error(`Error validating JSON Schema of test vector at path ${filePath}: `, validate.errors)
        success = false
      }
    })

  if (success) {
    console.log('SUCCESS: All test vectors are valid')
  } else {
    console.log('FAIL: There were errors validating test vectors')
  }
}

// Compile the valid JSON files into an array
validateTestVectors();
