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
        console.log('An error has occured')
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
const comp2 = (temp , found) => {
    var vars = {}
    inVar = false
    for (let t = 0; t < temp.length; t++) {
        let tempWord = temp[t];
        if(tempWord.type==='var'){
            inVar = true
            continue
        }
        for (let f = t; f < found.length; f++) {
            let foundWord  = found[f];
            if(tempWord.value === foundWord.value && tempWord.type !== 'var'){
                console.log(foundWord.value)
                break
            }else if(tempWord.type==='var'){
                if(temp[t-1] && temp[t-1].value===found[f].value){
                    continue
                }
                let nextTemp = temp[t+1]
                let nextFound = found[f+1]
                vars[tempWord.value] = (vars[tempWord.value] || '')
                vars[tempWord.value] += ' '+foundWord.value
                vars[tempWord.value] = vars[tempWord.value].trim()
                if(nextTemp && nextFound && nextTemp.value === nextFound.value){
                    break
                }
            }
        }
    }
    return vars
}

function handle (str, id) {
    console.log(`handle ${str} ${id}`)
    return comp1(str)
}



userRules = [
    {
        id: 'pyArrayNegative',
        template: '{{array}} [ {{n1}} ]',
        output: function({array, n1}){
            if(n1<=0){
                return `${array}[${n1}]`
            }
            return `${array}[${array}.length - ${n1}]`
        }
    },
    {
        id: 'minusArrowFunction',
        template: '({args}) a1 a2 a3 a4 {{code}}',
        output: function({args, code}){
            return `(${args}) => ,${code}`
        }
    }
]
console.log(
    // compileMAIN('arr [2]', userRules),
    compileMAIN('(arg1, arg2) a1 a2 a3 a4 aaa', userRules), ' dash FAAIIILLLLL'
    // compileMAIN('a z hhj b', userRules),
)

// console.log(
//     comp2(
//         runRules.parseTemp('{x}z{y}', true),
//         runRules.parseCode('a z hhj b', false),
//     )
// )
