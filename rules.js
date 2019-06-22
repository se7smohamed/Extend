const c = require('./config')
const utils = require('./utils')

let found = `[ a.x.y.z for a in list ]` // what is expected to be found just for example.
let rule = '[{{varSpec}}   for {{var}} in {{array}}]' // the actucal rule that the compiler is looking for.
// rule = utils.spaceOutTokens( rule, utils.tokens, ' ', ['{{', '}}']).unspace('')
// console.log( rule )


let getRule = (currRule, s=c.varStartE, e=c.codeEndE) => {
    let varRegEx = new RegExp( `${ c.varStartE }\\w+${ c.varEndE }`,'g' )
    let keyWordRegEx = new RegExp( `[\\s+]+[\\w+]*[\\s+]+`,'g' )
    console.log('[currRule]', currRule)
    let r = new RegExp( `${c.varStartE}\\S+${c.varEndE}`,'g' )
    let keywords = rule.match(keyWordRegEx).map( k => k.trim() )
    let vars = rule.match(varRegEx)
    let varsClean = vars.map( v => v.slice(c.varStart.length, -c.varEnd.length) )
    let ruleArray = currRule.split(' ')

    currRule = currRule.trim()
    let currRuleNoBrases = currRule
    vars.forEach( (v, i) => currRuleNoBrases = currRuleNoBrases.replaceAll(v, varsClean[i] ) )
    currRuleNoBrases = currRuleNoBrases.unspace()
    // currRuleNoBrases = currRuleNoBrases.replaceAll(c.varEnd,'').unspace()
    // utils.log('rule no braces', currRuleNoBrases, 14)
    ruleArray = currRuleNoBrases.split(' ')
    // utils.log('ruleArrAf', ruleArray, 12)
    // console.log('varsClean: ', varsClean)
    // console.log('keywords: ', keywords)
    // currRuleNoBrases = currRule.repl

    // console.log('[ruleArray]', ruleArray)
    // matches = currRule.slice(1, -1).match(r)
    // matches = currRule.match(r)
    // console.log('[ruleMatches]', matches)
    // console.log('[matches] ', matches)

    // if ( matches === null ){ matches = [] }

    // cleanedMatches = matches.map( m => m.slice( c.varStart.length, -c.varEnd.length))
    // console.log('[clened matches]', cleanedMatches)

    let indexes = varsClean.map( match => ruleArray.indexOf(match) )
    console.log(indexes)

    return {vars: varsClean, array: ruleArray, indexes}
}
// console.log( getRule(rule) )

let ruler = ( found, rule, callback=()=>{}, pre=a=>a ) => {
    let r = getRule(rule)
    found = pre(found)
    foundArr = found.unspace().trim().split(' ')
    let varObj = {}
    let foundMatches = r.indexes.map( el => foundArr[el] )
    foundMatches.forEach( (match, i) => varObj[ r.vars[i] ] = match )
    obj = { vars: varObj }
    console.log(obj)
    return callback( obj )
}
// console.log( ruler(found, rule) )

exports.ruleListComper = ruleListComper = function(found) {
    console.log('-'.repeat(22))
    console.log('[received]', found)
    found = found.trim()
    
    return ruler( found, rule, (obj) => {
        // console.log('[comper] ', obj)
return `${obj.vars.array}.map( function(${obj.vars.var}){
    return (${obj.vars.varSpec})
})
`       }
    )
}

// alt?
// exports.ruleListComper = ruleListComper = function(found) {
//     console.log('-'.repeat(22))
//     console.log('[found]', found)
//     found = found.trim()
    
//     return ruler( found, rule, o => (
//         array.map( function(_var) {
//             return (varSpec)
//         })
//     ))
// }



    
// , found => {
//     // console.log('foundfoundfoundfound',found)
//     if( found[0] === '[' && found.slice(-1) === ']' ){
//         // console.log('kjljjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
//         found = found.slice(1, -1)
//     }
//     return found
// })
// }

module.exports = {ruleListComper}


// packed = {
//     rule: rule,
//     function: ruleListComper,
// }

// let listPacked = ruler(rule, callback)
// console.log()

// ruler => rule, callback, pre => { (found) => sourceCode }