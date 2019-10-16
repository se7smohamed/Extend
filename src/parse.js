// how it should look
// {{var}} value eg: varname / func call / class initializaion / () / [] / {}
// {{var?default}} varialbe with default value
// (k1,k2,k3) multiple possible kws
// 
// {{var: (word, s, e)}}
i 0 10 {
    console.log(i)
}


`
{{i:'w'}} ( {{s:'w'}} (to/til/) {{e:'w'}} ) {
    {{code}}
}
`

word = {
    str: 'word',
    found: 'word ',
};
token = {
    str: 'word',
    found: 'word ',
    type: 'keyword/var',
};

let terminals = ['_{', '}']
let quotes = ['"', "'", '`']

const getWithoutStr = str => {
    
}
const extractCode = str => {
    // will eventually return an array of code
    const insertAtIndex = (str, val, i) => str.slice(0, i) + val + str.slice(i)
    // find 1st  // find 2nd  // skip in quotes
    var inString = false
    var strChar = ''
    inCode = false
    var total = ''
    var strings = []
    var codes = []
    for(let i=0; i<str.length; i++){
        let letter = str[i]
        if(quotes.includes(letter)){
            // found a quote letter
            if(!inString){
                // found a new string
                strChar = letter; inString = true
                strings.push({index: i, str: letter})                
            }else{
                // str ended, either matching char or eol with ' or "
                if(letter === strChar || (letter === '\n' && strChar!=='`')){
                    strChar = ''; inString = false;
                }
                // else{
                strings[strings.length-1].str += letter
                // }
            }
        }else if( terminals[0] === str.slice(i, i+terminals[0].length) ){
            inCode = true
            codes.push('')
        }else if( inCode ){
            codes[codes.length-1] += letter
        }else if(terminals[1] === str.slice(i, i+terminals[1].length) ){
            inCode = false
        }else{
            if(!inString){
                total += letter
            }else{
                strings[strings.length-1].str += letter
            }
        }
    }
    strings.forEach( str => {
        total = insertAtIndex(total, str.str, str.index)
    })
    return codes
}
console.log(
extractCode(
`
var var1 = 2
var varx = 'asdad'
var var3 = \`line un
line deux
line trois
\`
var lastValue = _{evaluatez moi}
var lll = 'lll'
`
)
)