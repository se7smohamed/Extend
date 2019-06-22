const c = require('./config')
newLine = '__newLineToken__'
// console.log('tokens tokens tokens ', tokens)
// console.log( c )
String.prototype.replaceAll = function(needle, replace){
    return this.valueOf().split(needle).join(replace)
}
exports.extractVarRegEx = extractVarRegEx = new RegExp( `${c.varStartE}\\S+${c.varEndE}`,'g' )
// String.prototype.replaceIndex = function(i, value) {
//     let string = this.valueOf()
//     if(i===0){return string}
//     // log('11', strParts, 11)
//     strParts = [ string.slice(0, i-1), string.slice(i) ]
//     // log('11', strParts, 11)
//     // console.log(i, value)
//     string = strParts[0] + strParts[1].split('').unshift(value)
//     return string
// }
exports.spaceOutTokens = spaceOutTokens = function(string, needles=c.tokens, skipIndexes=[]){
    // filter function to execlude specific strings
    needles.forEach( (needle, i) => {
        if( skipIndexes.includes(i) ){
            // console.log('[spaceOut] skipping', needle, i)
            return needle
        }
        string = string.replaceAll(needle, ' ' + needle + ' ')
    })
    // console.log(string)
    // string.split('').forEach( (char, i) => {
    //     if( skipIndexes.includes(i) ){
    //         // console.log('[spaceOut] skipping', char, i)
    //         return char
    //     }
    //     else if( needles.includes(char) ){
    //         // console.log('[spaceOut] spacing ', char)
    //         string = string.replaceIndex(i, ' ' + char + ' ')
    //         // console.log('[after replaceindex]', string)
    //         // string = string.replaceAll(char, ' ' + char + ' ')
    //     }
    // })
    // console.log('now string is ', string)
    return string
} // console.log(spaceOutTokens('asda [][a[}', tokens, ' '))

String.prototype.handleExtraSpaces = function(){
    let str = this.valueOf()
    return str.replace(/[^\S\r\n]+/g, ' ')
}
// todo
String.prototype.unspace = unspace = function(skipIndexes=[]) {
    let str = this.valueOf() 

    // space around every token so I dont have to worry about white space
    let tmpTokens = c.tokens.join('')
    // skipIndexes.map( el => tmpTokens = tmpTokens.replace(el, '') )
    tmpTokens = tmpTokens.split('')
    let forbidRegex = new RegExp(`${c.varStartE}\\S+${c.varEndE}`, 'g')
    let forbiddenIndexes = []
    while ((match = forbidRegex.exec(str)) != null) {
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', [
        //     c.varStart.length + match.index,
        //     c.varEnd.length + match.index + match[0].length,
        // ])
        // console.log(match)
        for(let i=0; i<c.varStart.length; i++){
            let foundIndex = match.index + i
            // console.log( 'blocking letter ', str[foundIndex] )
            forbiddenIndexes.push( foundIndex )
        }
        for(let i=0; i<c.varEnd.length; i++){
            let foundIndex = match.index + match[0].length - c.varStart.length + i
            // console.log( 'blocking letter ', str[foundIndex] )
            forbiddenIndexes.push( foundIndex )
        }

        // forbiddenIndexes.push( c.varEnd.length + match.index + match[0].length )
        // console.log('forbiddenIndexes', forbiddenIndexes)
    }    
    // console.log('[forbiddenIndexes]', forbiddenIndexes)

    str = spaceOutTokens(str, c.tokens ,forbiddenIndexes)
    str = str.replace(/[^\S\r\n]+/g, ' ').trim()
    return str
}

String.prototype.getIndexes = function(needle){
    let str = this.valueOf(),
    tmp = []
    str.split('').forEach( (el, i) => {
        if( str.slice( i, i + needle.length ) === needle ){
            tmp.push(i)
        }
    })
    return tmp
}
// exports.getIndexesToSkip = getIndexesToSkip = (rule, skips=[]) => {
//     let vars = []
//     let regex = new RegExp(`${ c.varStartE }[\\S\\s]*${ c.varEndE }`, 'g')
//     skips.forEach( skip => {
//         while ((match = re.exec(str)) != null) {
//             console.log('[][[]]', match)
//         }        
//     })
//     return rule
// }


exports.cleanOffRule = (rule) => {

}
let p = 10
exports.log = log = ( ...args ) => {
    let place = args[0]
    let priority = args.slice(-1)
    let msgs = args.slice(1, -1)
    if ( priority >= p ){
        console.log( `[${place}]`, ...msgs)
    }
}

// console.log(unspace('  asd asd asd asd           e.rgj.wbajef       '))
// console.log(rep('  asd asd asd asd        e.rgj.wbajef       '))
// console.log(unspace(word))


// exports.For = For = (num=0, callback=x=>x) => {
//     for(let i=0; i<c.varStart.length; i++){
//         callback(i)
//     }
// }