// decide either
// 1 parse braces until the end as one thing {{(xx1 xx2 xx3)}}
// 2 parse braces until the end as multiple {{(xx1) (xx2) (xx3)}}
// 3 parse braces until the expression ends {{(xx1)}} that's how it is right now

// variable as one expression / word / 
// keyword out of multiple possible
// not required kw / var or default
// variable array 

const fs = require('fs')
const parse = require('./parse')
const path = require('path')

var fileName = '' 
var buildName = '' 


var args = process.argv.slice(2)
switch(args.length){
    case 0:
        fileName = path.join(__dirname,'../', 'example', 'source.js.xs')
        buildName = fileName.split('.').slice(0, -1).join('.')
        break
    case 1:
        fileName = args[0]
        var list = fileName.split('.')
        buildName = list.slice(0,-1).join('.')
        if(list[list.length-1]!=='xs'){
            buildName += '.comp.' + list[list.length-1]
        }
        break
    case 2: 
        fileName = args[0]
        buildName = args[1]
        break
}

try{
    var sourceCode = fs.readFileSync(fileName).toString()
}catch(e){
    console.log(`An error has occured, please make sure file ${fileName} exists.`)
    process.exit(-1)
}


var debugging = 1
const writeToFile = (processed, fileName) => {
    fs.writeFile(fileName, processed, (err) => {
        console.log('Success.');
    });
}
const compile = () => {
    var value = parse.extracteur(sourceCode, ['{{', '}}']).text
    if(debugging){
        console.log( value )
    }else{
        writeToFile(value, buildName)
    }
}


compile()