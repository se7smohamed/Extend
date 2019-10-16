// Basic attempt using mustache syntax
// todo fix is string or seperate things

let terminals = ['{{', '}}']
let quotes = ['"', "'", '`']

const extractCode = (str, execluding, isString=1) => {
    const matchAny = (str, needles) => {
        for(let i = 0; i < needles.length; i++){
            if(str.slice(0, needles[i].length)===(needles[i])){
                return {
                    match: true,
                    length: needles[i].length,
                }
            }
        }
        return {match: false}
    }

    const stringFunc = () => {
        var list = [{str:''}]
        var stringDepth = 0
        var skipI = []

        for(let i=0; i<str.length; i++){

            if(skipI.includes(i) ){ continue }

            if(str.slice(i, i + execluding[0].length)===execluding[0]){
                stringDepth++
                str = str.slice(execluding[0].length-1)
                list.push({str: '', level:stringDepth})
                for(let i=0;i<execluding[0].length;i++){skipI.push(i)}

            }else if(str.slice(i, i + execluding[1].length)===execluding[1]){
                stringDepth--
                str = str.slice(execluding[1].length-1)
                list.push({str: '', level:stringDepth})
                for(let i=0;i<execluding[1].length;i++){skipI.push(i)}

            }else{
                list[list.length-1].str += letter
            }
        }
        return list
    }

    const levelFunc = () => {
        for(let i=0; i<str.length; i++){
            let letter = str[i]
        
            if(skipI.includes(i) ){
                if(!stringDepth) {list[list.length-1].letter += letter}
                continue
            }

            let hasMatch = matchAny(str.slice(i), execluding)        
            if(hasMatch.match){
                for(let j=i;j<hasMatch.length+i;j++){
                    skipI.push( j )
                }
                i===0 && list.push({str:'', letter, type: stringDepth})
                if(stringDepth){
                    if(letter === strChar || (letter === '\n' && strChar!=='`')){
                        strChar = ''; stringDepth--;
                    }
                    list.push({str:'', type: stringDepth})
                }else{
                    strChar = letter; stringDepth++
                    list.push({str: '', letter, type: stringDepth})
                }
            }else{
                i===0 && list.push({str:'', type: stringDepth})
                list[list.length-1].str += letter
            }
        }
        return list
    }

    var stringDepth = 0
    var strChar = ''
    inCode = false
    var list = []
    var skipI = []
    if(isString){ return stringFunc() } 
    else { return levelFunc() }
}


const reconstruct = (blocks, isString) => {
    if(isString){
        let str = ''
        for(let block of blocks){
            if(block.letter){
                str += block.letter + block.str + block.letter 
            }else{
                str += block.str
            }
        }
        return str
    }
}

let code = `
var var1 = 'string1'
var var2  = \`
xx1
xx2
xx3
\`
let extract = _{ prem = _{ second _{third}_}_}_
`
var txtt = 'var = "val"; var2 = `val2`; adasdsd'
var gett = extractCode(txtt , ['"', '"', '`'], 0)
var recc = reconstruct( gett, 1 )
console.log( `mine| ${recc}\ntext| ${txtt}`, recc===txtt )
