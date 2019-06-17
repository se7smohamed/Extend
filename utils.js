newLine = '__newLineToken__'
tokens = '[]{}|!^&*()-+=\\/&%,;'.split('')

String.prototype.replaceAll = function(needle, replace){
    return this.valueOf().split(needle).join(replace)
}

spaceOutTokens = function(string, needles, space=''){
    needles.forEach( needle => string = string.replaceAll(needle, space + needle + space))
    return string
} // console.log(spaceOutTokens('asda [][a[}', tokens, ' '))

// todo
exports.unspace = unspace = str => {
    // terrible hack to keep line breaks coz I'm offline and I hate RegEx..
    str = str.split('\n').join(newLine)
    // space around every token so I dont have to worry about white space
    str = spaceOutTokens(str, tokens, ' ')
    // replace all spaces with one space
    str = str.split( /\s+/).join(' ').trim()
    // line breaks are back b****es
    str = str.split(newLine).join('\n')
    
    return str
}


// console.log(unspace('  asd asd asd asd           e.rgj.wbajef       '))
// console.log(rep('  asd asd asd asd        e.rgj.wbajef       '))
// console.log(unspace(word))