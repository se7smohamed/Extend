let rules = require('./rules')
// i'll just leave this here.
let allChars = '\'"\\/.,`!@#$%^&*+-;:?><=[]{}()'.split('')
let escapeChar = '\\'
let symbolStack = []
let symbols = '[],{},()'.split(',')
let stringChars = '\',",`'.split(',')
let enders = [';', '\n', '\r']
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
            tmpArray.push( rest )
            tmpArray.push( char )
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


breakFoundExpr = (str) => {
    // todo
    let tmp = []
    let _new = false
    // let rest = ''
    str.split('').forEach( (char,i) =>{
        if(allChars.includes(char)){
            tmp.push( char )
            _new = true
            // rest = ''
        }else{
            if(_new){
                tmp.push( char )
                _new = false
            } else if(tmp[tmp.length-1]) {
                tmp[tmp.length-1] += char
            } else {
                tmp[tmp.length-1] = char
            }
        }
    })
    // tmp.push(rest)
    return tmp
}

// console.log(breakFoundExpr('word1 word2 word3,word4 / f2'))
// .join('')
let str = `let first = 'first string';
let myArray = [1,2, 3]
console.log('Oui'); let tmp = [ a for a in [ b for b in [ c for c in myArray ] ] ] ;`
