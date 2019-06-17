// white space
// rest of the file

const fs = require('fs')
const rules = require('./rules2')

const source = fs.readFileSync('./source.xs').toString()

let getAllBetween = (word, s, e) => {
    let toProcess = new RegExp( `${s}(.)+${e}`,'g' )
    matches = word.match(toProcess)
    // return console.log( matches )
    let cleaned = matches.map( m => m.slice(s.length, -e.length))
    console.log(cleaned)
    return cleaned
}

String.prototype.getIndeces = function(needle){

    let str = this.valueOf(),
    tmp = []
    str.split('').forEach( (el, i) => {
        if( str.slice( i, i + needle.length ) === needle ){
            // console.log('gett', el, i)
            tmp.push(i)
        }
    })
    return tmp
}

// console.log( 'axaxaxaxaxax'.getIndeces('ax') )

let cleanFile = str => {
    let inds = str.getIndeces('_{')
    // console.log('indexes', inds)
    let parts = []
    inds.forEach( (el, i, arr)=>{
        if( i===0 ){
            parts.push( str.slice(0, el) )
        }
        parts.push( str.slice( arr[i-1], el ) )
    })
    return parts
}

let processed = []
let cleaned = getAllBetween( source, '_{', '}')

console.log( cleanFile(source).length )
console.log( cleaned.length )

cleaned.map ( line => {
    processed.push( rules.ruleListComper(line) )
    // console.log('````````````````````````',processed)
})

fs.writeFile('./build.js', processed, (err, x)=>{
    console.log(x)
})