const c = require('./config')
let badCombinations = ['=>', '||', '>>', '<<', '++', '--', '+=', '-=', '*=', '/=', '%=', '==', '===', '!=', '!==',  ]

Array.prototype.includesAll = function(arr){
    if(!Array.isArray(arr)){ arr = [arr] }
    let all = true
    let go = true
    arr.forEach( el => {
        if ( !(go && this.valueOf().includes(el) )) {
            go = false; all = false
        }
    })
    return all
}

Array.prototype.flat = function(){
    return this.valueOf().reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

String.prototype.replaceAll = function(needle, replace){
    return this.valueOf().split(needle).join(replace)
}
String.prototype.splitMultiple = function(delimiters){
    let str = this.valueOf()
    strArray = str.split(delimiters[0]).flat()

    strArray.forEach( (strPart, i) => {
        delimiters.forEach( delimiter => {
            console.log(strArray)
            strArray[i] = strArray[i].split(delimiter)
        })
        strArray[i] = strArray[i].flat()
        // let tmp = strPart
        // return strPart.replace
    })
    // delimiters
    //     .slice(1)
    //     .forEach( delimiter => str.split(delimiter) )
}

String.prototype.splitKeep = function(delimiter){
    let regex = new RegExp(`(?=${delimiter})`, 'g')
    return this.split(regex)
}

exports.extractVarRegEx = extractVarRegEx = new RegExp( `${c.varStartE}\\S+${c.varEndE}`,'g' )
exports.spaceOutTokens = spaceOutTokens = function(string, needles=c.tokens, skipIndexes=[]){
    needles.forEach( (needle, i) => {
        if( skipIndexes.includes(i) ){
            return needle
        }
        // if( string.slice() )
        string = string.replaceAll(needle, ' ' + needle + ' ')
    })
    return string
}

String.prototype.removeExtraSpace = function(){
    return str.replace(/[^\S\r\n]+/g, ' ')
}

// todo
// fix or remove this method later
String.prototype.unspace = unspace = function(skipIndexes=[]) {
    let str = this.valueOf() 

    // space around every token so I dont have to worry about white space
    let tmpTokens = c.tokens.join('')
    tmpTokens = tmpTokens.split('')
    let forbidRegex = new RegExp(`${c.varStartE}\\S+${c.varEndE}`, 'g')
    
    let forbiddenIndexes = []

    // todo
    // a terrible way to leave braces for vars
    // prob not needed any more
    while ((match = forbidRegex.exec(str)) != null) {
        for(let i=0; i<c.varStart.length; i++){
            let foundIndex = match.index + i
            forbiddenIndexes.push( foundIndex )
        }
        for(let i=0; i<c.varEnd.length; i++){
            let foundIndex = match.index + match[0].length - c.varStart.length + i
            forbiddenIndexes.push( foundIndex )
        }
    }
    str = spaceOutTokens(str, c.tokens ,forbiddenIndexes)
    str = str.replace(/[^\S\r\n]+/g, ' ')

    // trim string while leaving new lines.. (it caused a bug)
    while(str[0]===' '){str=str.slice(1)}
    while(str[str.length-1]===' '){str=str.slice(0,-1)}

    return str
}

String.prototype.UNUSED_getIndexes = function(needle){
    let str = this.valueOf(),
    tmp = []
    str.split('').forEach( (el, i) => {
        if( str.slice( i, i + needle.length ) === needle ){
            tmp.push(i)
        }
    })
    return tmp
}

exports.escapeRegExp = escapeRegExp = (parameter) => {
    if( Array.isArray(parameter) ){
        return parameter.map( el => el.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') )
    }
    return parameter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}