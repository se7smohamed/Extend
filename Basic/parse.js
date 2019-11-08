// Compiler using mustache syntax
let runRules = require('./runRules')


exports.extracteur = (sourceCode, exeluding, userRules) => {
    // extract code that needs processing
    const find = (str, needle, i) => (str.slice(i,i+needle.length)===needle)
    const range = (s, e) => {
        let array = []
        for (let i = s; i < e; i++) { array.push(i) }
        return array
    }

    const strChars = ['"', "'", '`']
    var ingoreI = []
    var isOpen = false
    var inStr = {is: false, char: ''}
    var accumulator = ''
    var block = { text: '', succ: 1 }
    for (let i = 0; i < sourceCode.length; i++) {
        let letter = sourceCode[i];
        if(ingoreI.includes(i)){
            continue;
        }
        
        if(strChars.includes(letter)){
            if(!inStr.is){ //start
                inStr.char = letter;
            } else if(inStr.is && inStr.char===letter){ //end
                inStr.char='';
            }
            inStr.is = !inStr.is
            block.text += letter
            continue
        }
        if(inStr.is){
            block.text += letter
            continue
        }

        let foundOpen = find(sourceCode, exeluding[0], i)
        let foundClose = find(sourceCode, exeluding[1], i)
        if( foundOpen ){
            var res = this.extracteur(sourceCode.slice(i+exeluding[0].length), exeluding, userRules,  )
            if(res.text){
                block.text += compileMAIN(res.text, userRules) || ''
                ingoreI.push( ...range(i, i + res.text.length+ 2 * exeluding[1].length ) )
            }
        } else if(foundClose){
            ingoreI.push( ...range(i, i + exeluding[1].length) )
            if(accumulator){ block.text += compileMAIN(accumulator, userRules) }
            return block
        } else if(isOpen) {
            accumulator += letter
        }else if(false){

        }else if(!isOpen){
            block.text += letter
        }
    }
    accumulator ? block.text += compileMAIN(accumulator, userRules) : 0
    block.end = true
    return block
}


let handleRules = (userRules) => {
    for (const rule of userRules) {
        rule.parsed = runRules.parseTemp(rule.template)
        rule.enum = rule.parsed.map( word => {
            if(word.type === 'word'){
                if (!rule.config) return word
                // console.log(rule.config.words)
                return rule.config.words ? rule.config.words.map(w => w.enum)[0] : word
            }
            return []
        })
        // .filter(w => w)
    }
    return userRules
}
const compileMAIN = (sourceCode, userRules) => {
    try{
        let code = runRules.parseCode(sourceCode)
        let rules = GETTHERIGHTRULES(code, userRules)
        for (const rule of rules) {
            let obj = getVARS(rule, code)
            let result = rule.output(obj)
            if(result!==false){
                return result
            }
        }
    }catch(e){
        console.log('An error has occured, please double check your rules.', e)
    }
}

const GETTHERIGHTRULES = (code, userRules) => {
    let matching = []
    for (const rule of userRules) {
        rule.words = rule.parsed.filter(el => el.type !== 'var')
        let passing = true 
        for( let i = 0; i < rule.words.length; i++ ) {
            let word = rule.words[i]
            for( let j = 0; j < code.length; j++ ) {
                let foundWord = code[j]
                let res = compareWithKeyword(foundWord, rule, j)
                if( !res ){
                    passing = false;
                    continue;
                }
                passing = true
                break;
            }
            if(!passing){break}
        }
        if(passing){ matching.push(rule) }
    }
    return matching
}

var compareWithKeyword = (found, rule, i) => {
    let template = rule.parsed
    let word = template[i]
    if(rule.config && rule.enum && rule.enum[i]){
        return rule.enum[i].includes(found.value) || found.value === word.value 
    }
    return found && word && found.value === word.value
}

const getVARS = (rule, found) => {
    // all compiling is done here
    // template is array of parts/words of some rule
    // found is array of actuall source code (after some processing)
    // vars is the object returned containing all variables extracted
    // adj is a cursor to keep up with different indexes between template and found eg: variables consiting of more than one word
    // console.log(rule.template)
    let template = rule.parsed
    let vars = {}
    let inVar = false
    let adj = 0
    let skipI = false
    for (let i = 0; i < template.length; i++) {
        let tempWord = template[i];
        lastInVar = inVar
        inVar =  tempWord.type === 'var'
        
        if(skipI){
            skipI = false
            adj--
            continue
        }
        for (let j = i+adj; j < found.length; j++) {
            const foundWord = found[j];
            // console.log(tempWord.value, template[i+1].value, ' | ', foundWord.value, i, j)
            // todo there is probably a better way to do this

            // am i looking at the next word in template? take a step back
            if( template[i+1] && compareWithKeyword(foundWord, rule, i+1)){
                skipI = true
                break
            }
            // am i looking at the current word in template? this means im done, break to get to the next temp word
            if( tempWord.type!=='var' && compareWithKeyword(foundWord, rule, i) ){
                break
            }
            
            // it's a vriable, increment adj by 1, add the str to the vars object (str version keeps spaces)
            adj++
            if(inVar){
                vars[tempWord.value] = (vars[tempWord.value]||'')
                vars[tempWord.value] += (foundWord.str || foundWord.value) 
            }
        }
    }
    return vars
}

exports.handleRules = handleRules