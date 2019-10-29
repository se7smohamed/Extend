// Basic attempt using mustache syntax
let userRules = require('./userRules').rules
let runRules = require('./runRules')


exports.extracteur = (sourceCode, exeluding, strings, depth=0, full=1) => {
    // this will look at source code 
    const find = (str, needle, i) => (str.slice(i,i+needle.length)===needle)
    const findAny = (str, needles, i) => needles.some(needle => (str.slice(i,i+needle.length)===needle))
    const range = (s, e) => {
        let array = []
        for (let i = s; i < e; i++) { array.push(i) }
        return array
    }
    const strChars = ['"', "'", '`']
    var ingoreI = []
    var isOpen = false
    var inStr = {is: false, char: ''}
    var accum = ''
    var block = {
        text: '',
        succ: 1,
    }
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
            var res = this.extracteur(sourceCode.slice(i+exeluding[0].length), exeluding, '', depth+1, false )
            if(res.text){
                block.text += handle(res.text, depth)
                ingoreI.push( ...range(i, i + res.len + 2 * exeluding[1].length ) )
            }
        } else if(foundClose){
            ingoreI.push( ...range(i, i + exeluding[1].length) )
            accum ? block.text += handle(accum) : 0            
            block.len = i
            if(!full) {
                block.end = 111
                return block
            }
        } else if(isOpen) {
            accum += letter
        }else if(false){

        }else if(!isOpen){
            block.text += letter
        }
    }
    accum ? block.text += handle(accum) : 0
    block.end = true
    return block
}



txtt = 't0 {{ a = `{{f1}}` }}'


let handleRules = () => {
    for (const rule of userRules) {
        rule.parsed = runRules.parseTemp(rule.template)
    }
}
const compileMAIN = (sourceCode, userRules) => {
    handleRules()
    try{
        let code = runRules.parseCode(sourceCode)
        let rule = GETTHERIGHTRULE(code, userRules)
        let obj = comp2(rule.parsed, code)
        let result = rule.output(obj)
        return result
    }catch(e){
        console.log('An error has occured, please double check your rules.', e)
    }
}

const GETTHERIGHTRULE = (code, userRules) => {
    let matching = false
    for (const rule of userRules) {
        rule.words = rule.parsed.filter(el => el.type !== 'var')
        let all = true 
        for( let word of rule.words ) {
            for( let foundWord of code ) {
                if( word.value!==foundWord.value ){
                    all=false;
                    continue;
                }
                all = true
                break;
            }
            if(!all){break}
        }
        
        if(all){
            matching = rule
        }
    }

    return matching
}

const comp2 = (template, found) => {
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
            continue
        }
        for (let j = i+adj; j < found.length; j++) {
            const foundWord = found[j];

            console.log(
                i, j, template[i].value, found[j].value,
                template[i+1] && template[i+1].value === foundWord.value,
                tempWord.type!=='var' && tempWord.value === foundWord.value 
            )
            if( template[i+1] && template[i+1].value === foundWord.value){
                // console.log('-break 1', foundWord, i, j)
                skipI = true
                adj--
                console.log('stop 1')
                break
            }
            if( tempWord.type!=='var' && tempWord.value === foundWord.value ){
                // console.log('-break 2', foundWord, i, j)
                // adj++
                console.log('stop 2')
                break
            }
            adj++
            if(inVar){
                vars[tempWord.value] = (vars[tempWord.value]||'')
                vars[tempWord.value] += (foundWord.value)
                vars[tempWord.value] = vars[tempWord.value].trim()
            }
        }
    }
    
    return vars
}

function handle (str, id) {
    console.log(`handle ${str} ${id}`)
    return comp1(str)
}



console.log(
    compileMAIN('arr [2]', userRules),
    compileMAIN('(arg1, arg2) -> {func1(); funct2()}', userRules),
    compileMAIN('let w1.w2 = w3.w4', userRules),
)