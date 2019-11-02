const fs = require('fs')
const parse = require('./parse')
const path = require('path')

let fileName =  path.join(__dirname, 'example', 'source.js.xs')
let sourceCode = fs.readFileSync(fileName).toString()
let buildName = fileName.split('.').slice(0, -1).join('.')

let doWrite = true
const writeToFile = (processed, fileName) => {
    fs.writeFile(fileName, processed, (err) => {
        console.log('Success.');
    });
}
const compile = () => {
    let value = parse.extracteur(sourceCode, ['{{', '}}']).text
    if(doWrite){
        writeToFile(value, buildName)
    }else{
        console.log( value )
    }
}


compile()