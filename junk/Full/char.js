// Forget about this
// the point of this was handling the case where the user uses an unbalanced rule eg: 'word word { ( etc..'
// just throw an error and move to the next..

let rules = require('./rules')
// i'll just leave this here.
let escapeChar = '\\'
let symbolStack = []
let symbols = '[],{},(),\'\',"",``'.split(',')
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

let scanForWord = (strArray, word) => {
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


let charParse = str => {
    str.split('').forEach( (char, i) => {
        // 1st test for rule
    })
}