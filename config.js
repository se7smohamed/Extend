// rule variable characters

// vars: varible starting letter in rule example: 'keyword1 keyword2 {{variable}}'
// vare: end
// codes: code block starting character example: '_{ new syntax goes here -=>() }
// codes: end
// others are escaped for regex
// terrible names, i know.. just for now

module.exports = c = {
    varStart: '{{',
    varEnd: '}}',
    codeStart: '_{',
    codeEnd: '}',
    varStartE: '\\{\\{',
    varEndE: '\\}\\}',
    codeStartE: '_\\{',
    codeEndE: '\\}',
}


module.exports.tokens = tokens = '[]{}|!^&*()-+=\\/&%,;'.split('').concat(c.varStart)


// let escapeForRegEx = 1;
// if ( escapeForRegEx ){
//     Object.keys(c).forEach( key => {
//         c[key] = c[key].split('').map( letter => '\\' + letter ).join('') 
//     })
// } else{ 
//     c.es = c.vars;
//     c.ee = c.vare
// }