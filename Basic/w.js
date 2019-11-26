var commandLineArgs = require('command-line-args')
var fs = require('fs')
var fse = require('fs-extra')
var path = require('path')
var chokidar = require('chokidar')
var parse = require('./parse')
var example = require('./example')


var watcher = chokidar.watch('file or dir', {ignored: /^\./, persistent: true});
var folders = ['src', 'dist']
var extentions = [['xt'], ['xt', 'js']]
var fileName = path.join(process.cwd(), folders[0])
var rulesShort = '_rules.js'
var rulesFileName = path.join(process.cwd(), folders[0], rulesShort)

var optionDefinitions = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'example', alias: 'e', type: Boolean }
]

try{
    var cliOptions = commandLineArgs(optionDefinitions)
}catch(error){
    console.log('Unknown argument', error.optionName)
    console.log('Use -h for to show instructions.')
    process.exit()
}

if( cliOptions.help ){
    console.log(`use --example or -e to create a basic example, \nPlease refer to https://github.com/se7smohamed/Extend for further help.`)
    process.exit()
}else if( cliOptions.example ){
    console.log('Creating a Hello World example.')
    example.text.forEach( file => {
        fse.outputFileSync(file.file, file.text)
    })
}



var getUserRules = () => {
    try{
        userRules = require( path.join(rulesFileName) ).rules
        userRules = parse.handleRules(userRules)
        return userRules
    }catch(MODULE_NOT_FOUND){
        console.log('_rules.js not found')
        return []
    }
}


var writeToFile = (processed, fileName) => {
    fse.outputFileSync(fileName, processed)
}

var compile = (fileName) => {
    var shoudCompile = (name) => {
        var nameList = name.split('.')
        if( path.basename(name) === rulesShort ){ return rulesShort }
        if( nameList.slice(-1).join() === extentions[0].join() ){ return 'compile1' }
        if( nameList.slice(-2).join() === extentions[1].join() ){ return 'compile2' }
        console.log( extentions, 'xxxx', nameList.slice(-1), nameList.slice(-2))
        return 'pass'
    }
    var getPathAfterSrc = (fileName) => {
        var rmvPath = path.join(process.cwd(), folders[0])
        var relativePath = fileName.replace(rmvPath, '')
        var outPath = path.join(folders[1], relativePath)
        return outPath
    }
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
    if(doCompile==='compile2'){ writeName = writeName.replace('.xt', '') }
    writeName = writeName.replace( path.extname(writeName), '.js' )
    writeToFile(value, writeName)
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