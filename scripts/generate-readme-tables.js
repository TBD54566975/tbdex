const { readFile } = require('fs').promises

const typesFilePath = __dirname + '/../js/src/types.ts';

/////////////////////////////////////////////////
///              🔥⭐️ Tokens ⭐️🔥             ///
/////////////////////////////////////////////////

class PropertyDeclaration {
  constructor(name, type, description) {
    this.name = name;
    this.type = type;
  }
}

class Comment {
  constructor(text) {
    this.text = text
  }
}

class TableEntry {
  constructor(declaration, comment) {
    this.declaration = declaration;
    this.comment = comment;
  }
}

/////////////////////////////////////////////////
///              🔥⭐️ Main ⭐️🔥               ///
/////////////////////////////////////////////////

readFile(typesFilePath, { encoding: 'utf8' })
  .then(collectGroupedText)
  .then(lexAndTokenize)
  .then(reduceComments)
  .then(constructTableEntries)
  .then(drawTables)
  .catch((error) => console.error(error));

/////////////////////////////////////////////////
///      🔥⭐️ Collecting Type Text ⭐️🔥       ///
/////////////////////////////////////////////////

// Input - A string containing the entire text of the file.
// Output - A 2D array where each index contains the list of strings that make up a TS type definition
// For Example, each index contains a list of strings separated by new lines that make up the following::
//
// export type Example {
//   name: String
//   description: String?
// }
//
function collectGroupedText(rawTextData) {
  let typeDefinitions = [];
  let currentType = [];
  let braceCounter = 0;
  let lineNumber = 0; // For debugging

  // doesn't currently support enums.
  for (let line of rawTextData.split("\n")) {
    lineNumber += 1;

    // No inner structure - its just a single line export.
    if (isASingleLineDefinition(line, braceCounter)) {
      continue;
    }

    if (isAMultiLineDefinition(line, braceCounter)) {
      braceCounter += 1;
      currentType.push(line);
      continue
    }

    if (braceCounter == 0) {
      continue;
    }

    // A nested type.
    if (isANestedTypeDefinition(line, braceCounter)) {
      currentType.push(line);
      braceCounter += 1;
      continue;
    }
 
    // We've hit a closing brace
    if (line.includes("}") && braceCounter > 0) {
      braceCounter -= 1;
      currentType.push(line);
      if (braceCounter == 0 && line.includes('}')) {
        typeDefinitions.push(currentType);
        currentType = [];
      }

      continue;
    }

    if (braceCounter >= 0) {
      currentType.push(line);
      continue;
    }
  };
  return typeDefinitions;
}

function isASingleLineDefinition(line, braceCounter) {
  if (
    (line.includes("export type") || line.includes('export interface'))
    && (line.includes("}") || (!line.includes('{') && !line.includes('{'))) // One line definitions not supported.
    && braceCounter == 0
  ) {
    return true;
  }
  return false;
}

function isAMultiLineDefinition(line, braceCounter) {
  if (
    (line.includes("export type") || line.includes('export interface'))
    && !line.includes("}") 
    && line.includes("{")
    && braceCounter == 0
  ) {
    return true;
  }
  return false;
}

function isANestedTypeDefinition(line, braceCounter) {
  // A nested type.
  if (line.includes("{") && !line.includes("export type") && !line.includes("export interface") && braceCounter > 0) {
    return true;
  }
  return false;
}

/////////////////////////////////////////////////
///           🔥⭐️ Tokenizing ⭐️🔥            ///
/////////////////////////////////////////////////

class NestedTypeDefinition {

  constructor() {
    this.name = null;
    this.isOptional = null;
    this.originalIndex = null;
  }

  set(rawName, originalIndex) {
    this.name = rawName.replace('?', '');
    this.isOptional = isOptionalType(rawName);
    this.originalIndex = originalIndex;
    this.type = this.isOptional ? "object | null" : "object";
  }

  hasNoName() {
    return this.name == null;
  }

  reset() {
    this.name = null;
    this.originalIndex = null;
  }
}

// Processes the raw types into tokens - ie `PropertyDeclaration` and `Comment`
// Replaces nested types with 'object'.
// Input - A 2d array containing the line by line string representation of a Javascript type definition for each type inside a file
// Output - A 2d list where each index contains a tuple of the type name and a list of either comments or property declarations.
function lexAndTokenize(typeDefinitions) {
  let result = [] // (outer name, [(inner name, type)])
  let currentComment = ""

  typeDefinitions.forEach((definition) => {
    // Captures the title of the tile - eg `Offering` in `export type Offering`
    let outerTypeName = extractOuterTypeNameFrom(definition);
    let innerTypeStructure = innerTypeStructureFrom(definition);

    // working out how to process nested types
    let braceHeight = 0;
    let i = 0;
    let nestedTypeHolder = new NestedTypeDefinition();

    // Iterate through the inner types
    while(i < innerTypeStructure.length) {
      line = innerTypeStructure[i];
      // if you see an opening brace you've found an object
      if (encounteringNestedType(line, nestedTypeHolder)) {
        // record that we're operating on a nested type
        // extract the name
        nestedTypeHolder.set(line.split(":")[0], i);
        innerTypeStructure.splice(i, 1);
        braceHeight += 1;
        continue;
      }

      // Delete the inner lines since we don't need them.
      if (isInsideNestedType(line, braceHeight)) {
        innerTypeStructure.splice(i, 1);
        continue;
      }

      // we've currently looking at the lines inside a nested type
      if (encounteringClosingBraceIn(line)) {
        braceHeight -= 1;

        // We're still inside a nested type.
        if (braceHeight > 1) {
          // throw away each line
          innerTypeStructure.splice(i, 1);
          continue;
        }

	// When we reach the final closing brace
        if (braceHeight == 0) {
          // Delete it.
          innerTypeStructure.splice(i, 1);
          // create a 'name: object' entry and insert it into the inner type structure
          // thus representing the whole nested type as a complex object.
          innerTypeStructure.splice(nestedTypeHolder.originalIndex, 0, "" + nestedTypeHolder.name + ": " + nestedTypeHolder.type);
          nestedTypeHolder.reset();
          i +=1;
          continue;
        }
      }
      i += 1;
    }

    // Captures the inner details as a `PropertyDeclaration` or a `Comment`
    let innerDefinitions = innerTypeStructure.map((innerContents) => extractInnerTypeNameAndDefinitionFrom(innerContents));
    result.push([outerTypeName, innerDefinitions])
  });
  return result; 
}

function isOptionalType(typeName) {
  return typeName.includes('?') ? true : false;
}

function encounteringNestedType(line, nestedTypeHolder) {
  if (line.includes('{') && nestedTypeHolder.hasNoName()) {
    return true;
  }
  return false;
}

function isInsideNestedType(line, braceHeight) {
  if (!line.includes("{") && !line.includes("}") && braceHeight > 0) {
    return true;
  }
  return false;
}

function encounteringClosingBraceIn(line) {
  if (line.includes('}')) {
    return true;
  }
  return false;
}

// Input - 
function extractOuterTypeNameFrom(definition) {
  let firstLine = definition[0]
    .slice() // making a deep copy so we don't side effect the contents of the reference
  return firstLine
    .replace("export", "")
    .replace("type", "")
    .replace("interface", "")
    .replace("=", "")
    .replace("{", "")
    .trim();
}

// Strips the first and last line from a list of strings.
// This essentially extracts the inner strcuture inside the braces of a code block.
function innerTypeStructureFrom(definition) {
  definition.shift(); // dereference, discard index 0 and shift left, getting rid of the first line
  definition.pop(); // remove the last index, leaving just the inner array indices containing the inner definitions.
  return definition.filter((element) => element != null && element != undefined);
}

// Input - a string containing a Javascript property declaration, eg - `id: String`
function extractInnerTypeNameAndDefinitionFrom(innerTypeDefinition) {
  let copy = innerTypeDefinition.split()[0].trim();
  let firstTwoCharacters = copy.slice(0, 2);
  if (
    firstTwoCharacters == "//"
    || firstTwoCharacters == "/*" 
    || firstTwoCharacters == "* "
    || firstTwoCharacters == "*"
    || firstTwoCharacters == "*/"
  ) {
    return new Comment(copy.trim().replace(firstTwoCharacters, "").trim());
  }
  let result = innerTypeDefinition
    .trim()
    .replace(" ", "")
    .split(":");
  let rawType = result.pop();
  let rawName = result.pop();
  let type = isOptionalType(rawName) ? rawType + " | null" : rawType;
  let name = rawName.replace("?", "");
  return new PropertyDeclaration(name, type);
}

/////////////////////////////////////////////////
///      🔥⭐️ Reduction - Comments ⭐️🔥       ///
/////////////////////////////////////////////////

function commentReducer(accumulation, next) {
  let lastElement = accumulation[accumulation.length - 1];
  if (lastElement instanceof Comment && next instanceof Comment) {
    accumulation.pop();
    accumulation.push(new Comment((lastElement.text + " " + next.text).trim()));
    return accumulation
  }
  accumulation.push(next);
  return accumulation; 
}

function reduceComments(tokens) {
  return tokens.map((block) => {
    let innerTokens = block[1];
    let reducedTokens = innerTokens.reduce(commentReducer, []);
    return [block[0], reducedTokens];
  });
}

/////////////////////////////////////////////////
///    🔥⭐️ Reduction - Table Entries ⭐️🔥    ///
/////////////////////////////////////////////////

function constructTableEntries(tokens) {
  return tokens.map((block) => {
    let innerTokens = block[1];
    let tableEntries = innerTokens.reduce(tableEntryReducer, []);
    return [block[0], tableEntries];
  });
}

// Matches and converts `PropertyDeclaration` and `Comment` objects into `TableEntry` objects.
// In the process, assigns `???` to the description field of any `TableEntry` created from a 
// property declaration that does not have a matching comment.
// Inputs:
//   accumulation - a list of lexical tokens (either Comment or PropertyDeclaration)
//   next - the next lexical token in the list
function tableEntryReducer(accumulation, next) {
  let lastElement = accumulation[accumulation.length - 1];
  if (accumulation.length == 0 && next instanceof PropertyDeclaration) {
    accumulation.push(new TableEntry(next, new Comment(Constants.UNKNOWN_DESCRIPTION)));
    return accumulation;
  }

  if (accumulation.length == 0 && next instanceof Comment) {
    accumulation.push(next);
    return accumulation;
  }

  if (lastElement instanceof Comment && next instanceof PropertyDeclaration) {
    accumulation.pop();
    accumulation.push(new TableEntry(next, lastElement));
    return accumulation;
  }

  if (lastElement instanceof TableEntry && next instanceof PropertyDeclaration) {
    accumulation.push(new TableEntry(next, new Comment(Constants.UNKNOWN_DESCRIPTION)));
    return accumulation;
  }

  if (lastElement instanceof TableEntry && next instanceof Comment) {
    accumulation.push(next);
    return accumulation;
  }

  // should never happen
  if (lastElement instanceof PropertyDeclaration && next instanceof PropertyDeclaration) {
    accumulation.push(new TableEntry(next, new Comment(Constants.UNKNOWN_DESCRIPTION)));
    return accumulation;
  }

  if (lastElement instanceof PropertyDeclaration && next instanceof Comment) {
    // push the comment so that it gets picked up next recurse
    accumulation.push(next);
    return accumulation;
  }

  return accumulation;
}

/////////////////////////////////////////////////
///     🔥⭐️ Table Drawing - Main ⭐️🔥        ///
/////////////////////////////////////////////////

// Draws the table from all the information that we've collected.
function drawTables(tables) {
  tables.forEach((table) => {

    console.log("Table for " + table[0]);

    let tableEntries = table[1];
    let longestPropertyLength = longestNameLengthFrom(tableEntries);
    let longestTypeLength = longestTypeLengthFrom(tableEntries); 
    let longestDescriptionLength = longestDescriptionLengthFrom(tableEntries);

    console.log(
      Foreground.BOLD
      + "-".repeat(10 + longestPropertyLength + longestTypeLength + longestDescriptionLength)
      + Styling.FINISHED
    );

    console.log(
      Foreground.BOLD + "| "
      + Constants.TABLE_HEADER_NAME_TITLE
      + " ".repeat(1 + longestPropertyLength - Constants.TABLE_HEADER_NAME_TITLE.length)
      + "| "
      + Constants.TABLE_HEADER_TYPE_TITLE
      + " ".repeat(1 + longestTypeLength - Constants.TABLE_HEADER_TYPE_TITLE.length)
      + "| "
      + Constants.TABLE_HEADER_DESCRIPTION_TITLE
      + " ".repeat(1 + longestDescriptionLength - Constants.TABLE_HEADER_DESCRIPTION_TITLE.length)
      + "|"
      + Styling.FINISHED
    );

    console.log(
      Foreground.BOLD
      + "-".repeat(10 + longestPropertyLength + longestTypeLength + longestDescriptionLength)
      + Styling.FINISHED
    );

    tableEntries.forEach(definition => {

      let propertyName = definition.declaration.name;
      let propertyType = definition.declaration.type;
      let propertyDescription = definition.comment.text;
      let shouldStyleDescription = descriptionIsMissing(propertyDescription);
      let descriptionErrorColours = Foreground.BOLD + Foreground.WHITE + Background.RED;
      let styledDescription = shouldStyleDescription ? descriptionErrorColours + propertyDescription + Styling.FINISHED : propertyDescription;
      let rawDescriptionSpacing = " ".repeat(1 + longestDescriptionLength - propertyDescription.length);
      let styledDescriptionSpacing = shouldStyleDescription ? descriptionErrorColours + rawDescriptionSpacing + Styling.FINISHED : rawDescriptionSpacing;

      console.log(
        Constants.BORDER 
        + propertyName
        + (" ".repeat(1 + longestPropertyLength - propertyName.length))
        + Constants.BORDER
        + styleOptionalMonad(propertyType)
        + " ".repeat(1 + longestTypeLength - propertyType.length)
        + Constants.BORDER
        + styledDescription
        + styledDescriptionSpacing
        + Constants.TERMINAL_BORDER
      );
    });

    console.log(
      Foreground.BOLD
      + "-".repeat(10 + longestPropertyLength + longestTypeLength + longestDescriptionLength)
      + Styling.FINISHED
    );

    console.log("");
  });
}

/////////////////////////////////////////////////
///    🔥⭐️ Table Drawing - Helpers ⭐️🔥      ///
/////////////////////////////////////////////////

function longestNameLengthFrom(tableEntries) {
  return Math.max(
    tableEntries
      .slice()
      .map(x => x.declaration.name.length)
      .sort((x, y) => y - x)
      [0],
    Constants.TABLE_HEADER_NAME_TITLE.length
  );
}

function longestTypeLengthFrom(tableEntries) {
  return Math.max(
    tableEntries
      .slice()
      .map(x => x.declaration.type.length)
      .sort((x, y) => y - x)
      [0],
    Constants.TABLE_HEADER_TYPE_TITLE.length
  );
}

function longestDescriptionLengthFrom(tableEntries) {
  return Math.max(
    tableEntries
      .slice()
      .map(x => x.comment.text.length)
      .sort((x, y) => y - x)
      [0], 
    Constants.TABLE_HEADER_DESCRIPTION_TITLE.length
  );
}

function descriptionIsMissing(text) {
  if (text == Constants.UNKNOWN_DESCRIPTION) {
    return true; 
  }

  return false;
}

// Makes the '| null' portion of the type yellow so they stand out.
function styleOptionalMonad(text) {
  if (text.includes("| null")) {
    let components = text.split("|");
    let result = components.shift() + Foreground.YELLOW + "|" + components.pop() + Styling.FINISHED;
    return result;
  }

  return text;
}

/////////////////////////////////////////////////
///        🔥⭐️ Styling Helpers ⭐️🔥          ///
/////////////////////////////////////////////////

// Lets us specify when we're done with styling a piece of text with ANSI escape codes
const Styling = {
    // Important - we need to end each line with `FINISHED` otherwise colors and styles will spill.
    FINISHED: '\033[0m',
}

// Provides terminal styling of text backgrounds via ANSI escape codes
const Background = {
    BLACK: '\u001b[40m',
    RED: '\u001b[41m',
    GREEN: '\u001b[42m',
    YELLOW: '\u001b[43m',
    BLUE: '\u001b[44m',
    MAGENTA: '\u001b[45m',
    CYAN: '\u001b[46m',
    WHITE: '\u001b[47m',
}

const Foreground = {
    // Standard Colors
    BLACK: '\u001b[30m',
    WHITE: '\u001b[37m',
    BLUE: '\033[94m',
    CYAN: '\033[96m',
    GREEN: '\033[92m',
    YELLOW: '\033[93m',
    RED: '\033[91m',
    MAGENTA: '\u001b[35m',

    // Bright Colors
    BRIGHT_WHITE: '\u001b[37;1m',
    BRIGHT_BLACK: '\u001b[30;1m',
    BRIGHT_RED: '\u001b[31;1m',
    BRIGHT_GREEN: '\u001b[32;1m',
    BRIGHT_YELLOW: '\u001b[33;1m',
    BRIGHT_BLUE: '\u001b[34;1m',
    BRIGHT_MAGENTA: '\u001b[35;1m',
    BRIGHT_CYAN: '\u001b[36;1m',

    // Style Attributes
    BOLD: '\033[1m',
    UNDERLINE: '\033[4m',
}

const Constants = {
  UNKNOWN_DESCRIPTION: "???",
  TABLE_HEADER_NAME_TITLE: "Field",
  TABLE_HEADER_TYPE_TITLE: "Data Type",
  TABLE_HEADER_DESCRIPTION_TITLE: "Description",

  BORDER: Foreground.BOLD + "| " + Styling.FINISHED,
  TERMINAL_BORDER: Foreground.BOLD + "|" + Styling.FINISHED,
}

// Wow you read down to the bottom of the file!
/*
██████████████████████████▀▀▀████████████████████████████████████████████████
█████████████████████▀▀     ░░░░ ░   ░▀▀█████████████████████████████████████
███████████████████▀       ░   ░   ░      ▀██████████████████████████████████
█████████████████▀ ░                        ▐████████████████████████████████
████████████████  ░                        ░  ▀██████████████████████████████
███████████████▌ ░                             ▀█████████████████████████████
███████████████ ░                      ░░       ▐████████████████████████████
██████████████░ ░                    ░░░░░░      ████████████████████████████
█████████████░  ░░       ▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░▐░   ▐███████████████████████████
███████████▌░         ▄▒▒▒▒▒▒▒▒░▒▒▒▒░░░    ▒░░    ░██████████████████████████
███████████▒▒       ░▓▓░░▄▄▄▒▄░░░▒▒░░░░▒▒▒░░░░     ▐██████░░░████████████████
██████████▌▓▒▌     ▐░▒▓▓▒▒▒▒▒░  ░▒▒░░░░  █░░░▒▒     ██████▌░░▐███████████████
████████████ ▌      ▒▒▓▒▒▒▓  ▐▒  ▓▒▒░░░▒▒░░░▒▒▒▒    ▐▀█████▒░░███████████████
███████████ ██▌     ▒▓▓▒▒▒▒▒░░▒▒▓▓▓▒▒▒░▒▒▒▒▒▒▒▒▒ ▄▄   ▐████░░░ ██████████████
████████▌██ ██▌     ░▓▓▓▒▒▒▒▒▒▒▒▓▓▓▒▒▒▒░▒▒▒▒▒▒▒▒ ▓▒▒▒   ▀▀█▌░░░▐█████████████
████████▌██▌▐▀      ░▐▓▓▓▓▒▒▒▒▒▒▓▓▓▒▒▒▒▒▒▒▒▒▒▒░   ▀▒▒▒▒▄ ▐▌█░░░░█████████████
████████████▒░        ▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒░░▒▒▒▒▒░▒▒     ▓▒▒▒▒▄██░░░░▀▀▀██████████
████████████░          ▓▒▒▒▒▒▒▒▓▓▒▒▒▒▒▒░░░░░▒▒        ▓▒▒▒░░▒▒▒░░░░░░░░▀█████
█▒███████▀▒▄            ▓▒▒▒▒▒░▒▒░      ░▒▒░░           ▓▒▒▒▒▒▒▒░░░░░░░░ ████
██▄▄▄░░▄▄░▀▒             ▀▒▒▒▒▓▓▓▓▒▒▒▒▒▒▒▒░              ▐▒▒▒▒░░▒▒░░░░░░░ ███
████▒█▀██▌░                ░▀▒▒▒▒▒▒▒▒▒▒▒▒▒              ▄▄▄▒▒▒▒▓▒▒░░░░░░░░░██
████▒▒██▌▒░▄░▄                ░░▒▒▒▒▒▒░░               ████▒▒▒▒▒▒░░░░░░░░░░██
█████▒██▓░ ░░                  ░░░░░░░                 ░░▀██▌▒▒▒░░░░░░░░░░░██
██████░░░░░                     ░░░░░░░                ░░░░▀██░░░░░░░░░░░░░██
███▀▀░░░░ ░░                    ░░░░░░░                ░░░░░░▐█▄░░░░░░░░░░░▐█
▀░░░░░░░░░░░░    ░░              ░░░░░               ░  ░░░░░░░░█ ░░░░░░░░░░░
░░░░░░░░░░░░ ░                   ░░░░░░             ░░░ ░░░░░░░░▒░░░░░░░░░░░░
*/
