const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const inputDirectory = path.join(__dirname, '..', 'vectors');
const outputFilePath = path.join(__dirname, 'vectors.json');
const schemaFilePath = path.join(__dirname, '..', 'vector.schema.json');

function readJsonFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading JSON file at ${filePath}: ${error.message}`);
        return null;
    }
}

function getJsonFiles(directoryPath) {
    try {
        return fs.readdirSync(directoryPath)
            .filter(file => file.endsWith('.json'))
            .map(file => path.join(directoryPath, file));
    } catch (error) {
        console.error(`Error reading directory ${directoryPath}: ${error.message}`);
        return [];
    }
}

function validateJson(json, schema) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(json);

    if (!valid) {
        console.error(`Validation error: ${ajv.errorsText(validate.errors)}`);
    }

    return valid;
}

function compileJsonFiles(files, schema) {
    return files
        .map(file => readJsonFile(file))
        .filter(json => json !== null && validateJson(json, schema));
}

function writeOutputFile(outputFilePath, content) {
    try {
        fs.writeFileSync(outputFilePath, JSON.stringify(content, null, 2));
        console.log(`Compilation successful. Output written to ${outputFilePath}`);
    } catch (error) {
        console.error(`Error writing output file at ${outputFilePath}: ${error.message}`);
    }
}

// Load the JSON schema
const schema = readJsonFile(schemaFilePath);

if (!schema) {
    console.error('Unable to load JSON schema. Exiting.');
    process.exit(1);
}

// Get the list of JSON files in the "vectors" directory
const jsonFiles = getJsonFiles(inputDirectory);

// Compile the valid JSON files into an array
const compiledJson = compileJsonFiles(jsonFiles, schema);

// Write the compiled JSON array to the output file
writeOutputFile(outputFilePath, compiledJson);