var commandLineArgs = require('command-line-args')
var fs = require('fs')
var fse = require('fs-extra')
var path = require('path')
var chokidar = require('chokidar')
var parse = require('./parse')
var example = require('./example')


var watcher = chokidar.watch('file or dir', {ignored: /^\./, persistent: true});
var folders = ['src', 'dist']
var args = process.argv.slice(2)
var fileName = path.join(process.cwd(), folders[0])
var rulesShort = '_rules.js'
var rulesFileName = path.join(process.cwd(), folders[0], rulesShort)
var debugging = 0

var optionDefinitions = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'example', alias: 'e', type: Boolean }
]

try{
    var cmdOptions = commandLineArgs(optionDefinitions)
}catch(error){
    console.log('Unknown argument', error.optionName)
    console.log('Use -h for to show instructions.')
    process.exit()
}

if(cmdOptions.help){
    console.log(`use --example or -e to create a basic example, \nPlease refer to https://github.com/se7smohamed/Extend for further help.`)
    process.exit()
}else if(cmdOptions.example){
    console.log('Creating a Hello World example.')
    example.text.forEach( file => {
        fse.outputFileSync(file.file, file.text)
    })
}



var getUserRules = () => {
    userRules = require( path.join(rulesFileName) ).rules
    userRules = parse.handleRules(userRules)
    return userRules
}


var writeToFile = (processed, fileName) => {
    fse.outputFileSync(fileName, processed)
}

var compile = (fileName) => {
    var shoudCompile = (name) => {
        if( path.basename(name) === rulesShort ){ return rulesShort }
        if( path.extname(name) === '.xt' ){ return 'compile' }
        return 'pass'
    }
    var getPathAfterSrc = (fileName) => {
        var rmvPath = path.join(process.cwd(), folders[0])
        var relativePath = fileName.replace(rmvPath, '')
        var outPath = path.join(folders[1], relativePath)
        return outPath
    }
    var baseName = path.basename(fileName)
    var writeName = getPathAfterSrc(fileName)
    var doCompile = shoudCompile(fileName)
    if(doCompile === rulesShort ){ 
        userRules = getUserRules()
        watcher.unwatch(fileName)
        watcher.add(fileName)
        return 1
    }
    if(doCompile==='pass'){
        return writeToFile( fs.readFileSync(fileName).toString(), writeName )
    }

    console.log('Compiling')
    try{
        var sourceCode = fs.readFileSync(fileName).toString()
    }catch(e){
        console.log(`An error has occured, please make sure file ${fileName} exists.`)
        return 1
    }

    var value = parse.extracteur(sourceCode, ['{{', '}}'], userRules).text
    if(debugging){
        console.log( value )
    }else{
        writeName = writeName.replace( path.extname(writeName), '.js' )
        writeToFile(value, writeName)
    }
}

function unlink(fileName){
    fs.unlink(fileName, (error)=>{console.log('unlink error', error)})
}

watcher
    .on('add', compile)
    .on('change', compile)
    .on('error', function(error) { console.log('An error has occured error...\n', e) })

console.log('Started..')
var userRules = getUserRules()
watcher.add(fileName)