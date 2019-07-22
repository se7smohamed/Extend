let rules = require('./rules')
// i'll just leave this here.
let escapeChar = '\\'
let symbolStack = []
let symbols = '[],{},()'.split(',')
let stringChars = '\',",`'.split(',')
let enders = [';', '\n', '\r\n']
let opens = symbols.map(el=>el[0])
let closes = symbols.map(el=>el[1])
let symbolNest = []
// console.log(opens)

let skippedStrings = []
let skipStrings = (string) => {
    return
}
let isBalanced = (str)=>{}

let myArray = [[]]
let i = 0
let skipNext = false

let lookForWord = (strArray, word) => {
    let i = 0
    let matched = true
    word.split('').forEach( (char, j) => {
        if( strArray[i] === char ) {
            i++;
        }else{
            matched = false
        }
    })
    return matched
    // console.log(scanForWord('aaa aa aaaa aa', 'aaa aa'))
}

let lookForWords = (string, wordArray) => {
    let found = false
    return wordArray.some( (word, i) => lookForWord(string, word) )
}

// console.log( lookForWords('aaaaaaa', ['a','b']) )
// todo leave strings as is?
exports.breakExps2 = breakExps2 = (string) => {
    let caried = ''
    let tmpArray = []
    currWord = myArray[i]
    let rest = ''
    // console.log(string)
    string.split('').forEach( (char, i) => {
        if( char === escapeChar ) {
            return skipNext = true
        }
        if(skipNext){
            rest += ' ' + char + ' '
            return skipNext = false
        }
        if(stringChars.includes(char)) {
            
            if(symbolStack.slice(-1)[0] === (char) ) {
                rest += char
                symbolStack.pop()
            }else{
                rest += char
                symbolStack.push(char)
            }
        }
        else if(opens.includes(char)) {
            rest += char
            symbolStack.push(char)
        }else if(closes.includes(char)) {
            rest += char
            symbolStack.pop()
        }else if( enders.includes(char) ){
            tmpArray.push( rest + char )
            rest = ''
        }else{
            rest += char // ' ' + char + ' '
        }

        if( i===string.length-1 ){
            tmpArray[ tmpArray.length ] = ((tmpArray[ tmpArray.length ] || '') + rest).unspace()
        }
    })
    return tmpArray .filter( el => el!=='' )
}

let str = `let first = 'first string';
let myArray = [1,2, 3]
console.log('Oui'); let tmp = [ a for a in [ b for b in [ c for c in myArray ] ] ] ;`
