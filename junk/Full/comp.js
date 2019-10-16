const c = require('./config')
const fs = require('fs')
const rules = require('./rules')
const utils = require('./utils')
const parse = require('./parse')
let fileName = './source.js.xs'
let source = fs.readFileSync(fileName).toString()
let buildName = fileName.split('.').slice(0, -1).join('.')

let main = (parts) => {
    let processed = ''
    console.log(parts)
    parts.forEach( (part, i) => {
        processed += rules.recursiveLookForRule(part)
    })
    console.log(processed)
    writeToFile(processed)
    return processed
}

function writeToFile(processed) {
    fs.writeFile(buildName, processed, (err, x) => {
        console.log('Success.');
    });
}

main( parse.breakExps2( source ) )