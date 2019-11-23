// todo

var fs = require('fs')
var fse = require('fs-extra')
var path = require('path')
var chokidar = require('chokidar')
var parse = require('./parse')

var watcher = chokidar.watch('file or dir', {ignored: /^\./, persistent: true});
var folders = ['src', 'dist']
var args = process.argv.slice(2)
var fileName = path.join(process.cwd(), folders[0])
var rulesFileName = path.join(process.cwd(), folders[0], '_rules.js')
var debugging = 0

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
        if( path.basename(fileName) === rulesFileName ){ return '_rules' }
        if( path.extname(name) === '.xt' ){ return 'compile' }
        return 'pass'
    }
    var getPathAfterSrc = (fileName) => {
        var rmvPath = path.join(process.cwd(), folders[0])
        var relativePath = fileName.replace(rmvPath, '')
        var outPath = path.join(folders[1], relativePath)
        // console.log('\n', fileName, '\n', rmvPath, '\n', relativePath, '\n', outPath)
        return outPath
    }
    var baseName = path.basename(fileName)
    var writeName = getPathAfterSrc(fileName)
    var doCompile = shoudCompile(fileName)
    if(doCompile==='_rules'){ 
        userRules = getUserRules()
        watcher.unwatch(fileName)
        watcher.add(fileName)
    }
    console.log('Compiling')
    if(doCompile==='pass'){
        return writeToFile( fs.readFileSync(fileName).toString(), writeName )
    }
    try{
        var sourceCode = fs.readFileSync(fileName).toString()
    }catch(e){
        console.log(`An error has occured, please make sure file ${fileName} exists.`)
        process.exit(-1)
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
    // .on('unlink', unlink)
    .on('error', function(error) { console.log('An error has occured error...\n', e) })



console.log('Started..')
var userRules = getUserRules()
watcher.add(fileName)
// setTimeout( () => {
    
//     process.exit(1)
// }, 300)