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
var rulesFile = ''
var rulesFileName = '_rules.js'

// console.log(process.cwd())
// console.log(__filename)
// console.log(__dirname)
// process.exit()
var args = process.argv.slice(2)
switch(args.length){
    case 0:
        fileName = path.join(__dirname,'../', 'example', 'source.xt')
        rulesFile = path.join(__dirname,'../', 'example', '_rules.js')
        buildName = fileName.split('.').slice(0, -1).join('.') + '.js'
        break
    case 1:
        fileName = args[0]
        var list = fileName.split('.')
        buildName = list.slice(0,-1).join('.') + '.js'
        rulesFileName = path.join( path.dirname(fileName), rulesFileName)
        if(list[list.length-1]!=='xt'){
            buildName += '.comp.' + list[list.length-1]
        }
        break
    case 2: 
        fileName = args[0]
        buildName = args[1]
        break
}

let tempForTesting = false

if(tempForTesting){
    console.log('xxx', rulesFileName)
    rulesFileName = rulesFileName.split('\\').slice(0, -3).join('\\')
    console.log('xxx', rulesFileName)

}

// let userRules = eval(fs.readFileSync(rulesFileName).toString())
// console.log(__dirname, 'x', rulesFileName)
// console.log(process.argv)

let userRules = require( 
    path.join(process.cwd(), rulesFileName)
).rules
// console.log(fileName, buildName)
// console.log(':',userRules)
// process.exit()

userRules = parse.handleRules(userRules)


try{
    var sourceCode = fs.readFileSync(fileName).toString()
}catch(e){
    console.log(`An error has occured, please make sure file ${fileName} exists.`)
    process.exit(-1)
}


var debugging = 0
const writeToFile = (processed, fileName) => {
    fs.writeFile(fileName, processed, (err) => {
        console.log('Success.');
    });
}
const compile = () => {
    var value = parse.extracteur(sourceCode, ['{{', '}}'], userRules).text
    if(debugging){
        console.log( value )
    }else{
        writeToFile(value, buildName)
    }
}

compile()