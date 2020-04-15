// Compiler using mustache syntax

// todo handle bad rules

let parse = require("./parse");
var settings = {
  settings: false,
  showNotMatched: true,
  unmatchedTextFunction: block => {
    console.log(`none of the rules matched ${block.slice(0, 20)}`)
    return `/* none of the rules matched ${block}*/`
  },
  showMatchedRules: false
}
var unmatchedText = () => ''
if (settings.showNotMatched) unmatchedText = settings.unmatchedTextFunction

const compileBlock = (sourceCode, codeMarkers, userRules) => {
  try {
    let code = parse.parseCode(sourceCode);
    let rules = userRules;
    for (const ruleIndex in rules) {
      let rule = rules[ruleIndex]
      let variables = getVariables(rule, code, codeMarkers, 0, ruleIndex);
      if (!variables) continue;
      let result = rule.output(variables);
      if (result != false) {
        if (settings.showMatchedRules) console.log(`block ( ${sourceCode.slice(0, 10)} ): matched ${rule.template}`);
        return result;
      }
    }
  } catch (e) {
    console.log(e, "An error has occured, please double check your rules.");
  }
};

const range = (start, end) => {
  let array = [];
  for (let i = start; i < end; i++) array.push(i);
  return array;
};
exports.processCode = (sourceCode, codeMarkers, userRules, IS_ARRAY_CALL = false) => {
  // extract and process code in place
  const find = (str, needle, i) => str.slice(i, i + needle.length) === needle;
  const strChars = ['"', "'", "`"];
  var ingoreI = [];
  var isOpen = false;
  var inStr = { is: false, char: "" };
  var accumulator = "";
  let outputText = "";

  for (let i = 0; i < sourceCode.length; i++) {
    let letter = sourceCode[i];
    if (ingoreI.includes(i)) continue;

    if (strChars.includes(letter)) {
      // found string character like ' " `
      // add text as is
      if (!inStr.is) inStr.char = letter;
      else if (inStr.is && inStr.char === letter) inStr.char = "";

      inStr.is = !inStr.is;
      outputText += letter;
      continue;
    }

    // add to text to block
    if (inStr.is) {
      outputText += letter;
      continue;
    }

    let foundOpenCode = find(sourceCode, codeMarkers[0], i);
    let foundCloseCode = find(sourceCode, codeMarkers[1], i);
    if (foundOpenCode) {
      var res = this.processCode(
        sourceCode.slice(i + codeMarkers[0].length),
        codeMarkers,
        userRules,
        1
      );
      if (res) {
        // add any text that was processed and add to ignored list to avoid reprocessing
        outputText += compileBlock(res, codeMarkers, userRules) || unmatchedText(res);
        ingoreI.push(...range(i, i + res.length + 2 * codeMarkers[1].length));
      }
    } else if (foundCloseCode) {
      ingoreI.push(...range(i, i + codeMarkers[1].length));
      if (accumulator) { outputText += compileBlock(accumulator, codeMarkers, userRules); }
      return outputText;
    }
    else if (isOpen) accumulator += letter.value;
    else if (!isOpen) { outputText += letter.value || letter; }
  }

  if (accumulator)
    outputText += compileBlock(accumulator, codeMarkers, userRules);

  return outputText;
};


let handleRules = (userRules) => {
  for (const rule of userRules) {
    rule.parsed = parse.parseTemplate(rule.template);
    rule.enum = rule.parsed.map((word) => {
      if (word.type === "word") {
        if (!rule.config) return word;
        return rule.config.words
          ? rule.config.words.map((w) => w.enum)[0]
          : word;
      }
      return [];
    });
    // .filter(w => w)
  }
  return userRules;
};

var isRightKeyword = (found, rule, i) => {
  let template = rule.parsed;
  let word = template[i];
  if (!word) return false
  if (rule.config && rule.enum && rule.enum[i]) {
    return rule.enum[i].includes(found.value) || found.value === word.value;
  }
  return found && word && found.value === word.value;
};

/**
 * 
 * @param {*} rule has template which is array of words of some rule.
 * @param {*} found array of actuall source code (after some processing).
 * @param {*} wordAfterArray wordAfterArray is for array variable calls, it has the word right after the array.. duh?
 */
const getVariables = (rule, found, codeMarkers, wordAfterArray = 0, index = 'unknown') => {
  // rmv codemarkers
  // vars is the object returned containing all variables extracted
  // adj is a cursor to keep up with different indexes between template and found eg: variables consiting of more than one word
  var template = rule.parsed;
  var vars = {};
  var arrayVars = [{}];
  var insertArrayBlock = false;
  var inVar = false;
  var adj = 0;
  var skipI = false;
  var tempIndex = 0;
  var tempRealIndex = 0;
  var breakOutside = false;
  var breakInside = 0;


  while (true) {

    if (!wordAfterArray)
      if (!(tempIndex < template.length)) break

    if (wordAfterArray)
      if (tempIndex === template.length) {
        tempIndex = 0
        tempWord = template[tempIndex]
        insertArrayBlock = true
      }

    if (tempRealIndex > 100000) {
      console.log(`error: max iterations reached at code block ${index}. this may or may not be an issue ¯\\_(ツ)_/¯`)
      break
    }
    var tempWord = template[tempIndex];
    if (!tempWord) {
      console.log('no temp word', tempIndex, template)
      break
    }


    if (tempWord.type === 'arrayVar') {
      let sliceStart = foundIndex + 1
      let processed = getVariables({ parsed: tempWord.array },
        found.slice(sliceStart),
        codeMarkers,
        template[tempIndex + 1]
      )
      vars[tempWord.name] = processed
      tempIndex++
      tempRealIndex++
      continue;
    }

    inVar = tempWord.type === "var";
    if (skipI) {
      skipI = false;
      adj--;
      continue;
    }

    if (found.length === 0) break
    for (var foundIndex = tempRealIndex + adj; foundIndex < found.length; foundIndex++) {
      var foundWord = found[foundIndex];
      let nextTemp = template[tempIndex + 1]
      let nextFound = found[foundIndex + 1]


      if (nextTemp)
        if (nextTemp.type === 'arrayVar' && nextFound && (nextFound.value === nextTemp.array[0].value)) {
          breakInside = 1
        }

      if (wordAfterArray)
        if (nextTemp && wordAfterArray.value === foundWord.value) breakOutside = 2

      // am i looking at the next word in template?
      if (isRightKeyword(foundWord, rule, tempIndex + 1)) {
        skipI = true;
        if (!breakInside && !breakOutside) break
      }

      // am i looking at the current word in template?
      if (tempWord.type !== "var" && isRightKeyword(foundWord, rule, tempIndex)) {
        if (!breakInside && !breakOutside) break
      }

      adj++;
      if (wordAfterArray) {
        if (insertArrayBlock) { arrayVars.push({}); insertArrayBlock = false }
        addVariable(foundWord, tempWord, arrayVars[arrayVars.length - 1])
      }
      if (inVar) addVariable(foundWord, tempWord, vars)
      if (breakInside) { breakInside = 0; break; }
    }

    tempIndex++; tempRealIndex++;
    if (breakOutside) { breakOutside = 0; break; }
  }

  var tempVars = rule.parsed.filter((k) => ["var", 'arrayVar'].includes(k.type));

  // if is arraycall && any element is missing on any block remove block
  // else if any var is missing / or is array with 0 length then you are looking at the wrong rule.. return false
  if (wordAfterArray) {
    for (var arrayIndex in arrayVars) {
      var block = arrayVars[arrayIndex]
      for (var variable of tempVars) {
        var extractedValue = block[variable.value];
        if (!extractedValue) {
          arrayVars.splice(arrayIndex, 1);
        }
      }
    }
  } else {
    for (var variable of tempVars) {
      var extractedValue = vars[variable.value || variable.name];
      if (!extractedValue || (Array.isArray(extractedValue) && !extractedValue.length)) {
        settings.showNotFound && console.log(variable.value || variable.name, 'not found in', vars)
        return false;
      }
    }
  }


  if (wordAfterArray) return arrayVars
  return vars;
};

var addVariable = (foundWord, tempWord, object) => {
  object[tempWord.value] = object[tempWord.value] || "";
  object[tempWord.value] += foundWord.str || foundWord.value
}
exports.handleRules = handleRules;