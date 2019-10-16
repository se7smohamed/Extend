// the compiler
const fs = require('fs')
const userRules = require('./userRules')
const parse = require('./parse')

let fileName = './source.js.xs'
// let source = fs.readFileSync(fileName).toString()
let buildName = fileName.split('.').slice(0, -1).join('.')












/* copied */
let allIndexes = (match, str) => {
    let result, indexes = [];
    let left = 0
    while ( str.length ) {
        result = str.indexOf(match)
        if ( result === -1 ) {
            str = str.slice(1)
            left += 1
            continue
        }
        str = str.slice(match.length + result)
        indexes.push(left + result);
        left += result + match.length
    }
    return indexes
}

let breakExps = (str, level=0) => {
    let terminals = ['/*{', '}*/']
    let parts = []
    let startIndexes = allIndexes(terminals[0], str)
    let endIndexes = allIndexes(terminals[1], str)//.slice(level)
    if( startIndexes.length !== endIndexes.length) {
        return console.log('LengthError! ', level, startIndexes.length, endIndexes.length)
    }

    let value = str.slice(0, startIndexes[0]) 
    if ( value ) parts.push({ parse: 0, value })
    for(let i = 0; i < startIndexes.length ; i++){
        // console.log('a', startIndexes, endIndexes)
        if( startIndexes[i+1] && startIndexes[i+1] < endIndexes[i] && startIndexes[i+1] && endIndexes[i+1] ){
            endIndexes.splice(i, 0, startIndexes[i+1])
            startIndexes.splice(i+1, 1, startIndexes[i+1]+1)
            startIndexes.splice(i+2, 1, endIndexes[i+1]+1)
        }
        // console.log('c', startIndexes, endIndexes)
    
        value = str.slice(startIndexes[i] + terminals[0].length, endIndexes[i]) 
        if ( value ) parts.push({ parse: 1, value })

        // str until next part
        value = str.slice(endIndexes[i] + terminals[0].length, startIndexes[i+1])
        if( value && startIndexes[i+1] ){
            parts.push({ parse: 0, value })
        }
    }
    
    value = str.slice(endIndexes[endIndexes.length -1]+terminals[0].length)
    if ( value ) parts.push({ parse: 0, value })
    // !level && console.log(parts)
    // !level && console.log(parts.map( p => p.value ).join(''))
    return parts
}

let splitChars = (part) => {
    let allChars = '\'"\\/.,`!@#$%^&*+-;:?><=[]{}()'.split('')
    let rest = ''
    let value = [] //[...part.value]
    let chars = [...part.value]

    for(let char of chars){
        if( allChars.includes(char) ){
            if(value[0]===''){value=[char]; continue}
            value.push(rest)
            rest = '';
            value.push(char)
        }else{
            rest += char
        }
    }
    if(rest){ value.push(rest); rest=''}
    return value
}

let main = (parts) => {
    let processed = ''
    parts.forEach( (part, i) => {
        if(part.parse){
            let value = splitChars(part)
            let found = rules.lookForRule(value, value[0], 0)
            console.log('succ:', found)
            if( found.succ ){
                processed += found.value
            }
        }else{
            processed += part.value
        }
    })
    console.log('processed', processed)
    // writeToFile(processed)
    return processed
}

function writeToFile(processed) {
    fs.writeFile(buildName, processed, (err, x) => {
        console.log('Success.');
    });
}

// main( breakExps( source ) )
let s = '/*{s}*/'
let word = 'word'