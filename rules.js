const c = require('./config')
const utils = require('./utils')

let found = `[ a.x.y.z for a in list ]` // what is expected to be found just for example.
let rule = '[{{varSpec}}   for {{var}} in {{array}}]' // the actucal rule that the compiler is looking for.


let getRule = (currRule, s=c.varStartE, e=c.codeEndE) => {
    // console.log('r curr', currRule)
    let varRegEx = new RegExp( `${ c.varStartE }\\w+${ c.varEndE }`,'g' )
    // let keyWordRegEx = new RegExp( `[\\s+]+[\\w+]*[\\s+]+`,'g' )
    let keyWordRegEx = new RegExp( `[^(${ c.varStartE }\\w+${ c.varEndE })^ ]|[\\s+]+[\\w+]*[\\s+]+|[\\w+]*[\\s+]+`,'g' )
    
    // let keywords = currRule.match(keyWordRegEx).map( keyword => {
    //     console.log( `key: ${keyword} ` )
    //     return keyword.trim()
    // })
    
    let keywords = []
    // while( ( keyword = keyWordRegEx.exec(rule) ) !== null ){
    //     // console.log(keyword)
    //     keyword[0] = keyword[0].trim()
    //     keywords.push( keyword )
    // }
    // console.log('kw',keywords)

    let vars = currRule.match(varRegEx)
    let varsClean = vars.map( v => v.slice(c.varStart.length, -c.varEnd.length) )
    let ruleArray = currRule.split(' ')

    currRule = currRule.trim()
    let currRuleNoBrases = currRule
    vars.forEach( (v, i) => currRuleNoBrases = currRuleNoBrases.replaceAll(v, ' ' + varsClean[i] + ' ' ) )
    currRuleNoBrases = currRuleNoBrases.unspace()
    ruleArray = currRuleNoBrases.split(' ')
    
    ruleArray.forEach( el => {
        if (!varsClean.includes(el)){
            keywords.push(el)
        }
    })
    // console.log('rrrrrrrrrrrrr',ruleArray.indexOf('start'))
    let indexes = varsClean.map( el => {
        // console.log('rrrrr', el , ruleArray.indexOf(el))
        return ruleArray.indexOf(el.trim()) 
    })
    console.log('[ruleArr]', ruleArray)
    let obj = {vars: varsClean, array: ruleArray, indexes, keywords}

    // console.log('r obj ', obj)

    return obj
}

let ruler = ( found, rule, callback=()=>{}, pre=a=>a ) => {
    console.log('found:',found, '| rule:' , rule)
    let r = getRule(rule)
    found = pre(found)
    found = found.unspace().trim()
    foundArr = found.split(' ')
    r.keywords.forEach( keyword => {
        if( !foundArr.includes(keyword) ){
            foundArr.forEach( (found, i) =>{
                let kwIndex = found.indexOf(keyword)
                if( kwIndex !== -1 ){
                    let newFoundArr = [found.slice( 0, kwIndex ), keyword, found.slice( kwIndex+keyword.length )]
                    foundArr = foundArr.slice(0, i).concat(newFoundArr).concat(foundArr.slice(i+1))
                }
            })
        }
    })


    let matchVarsRegex = (start, end) => (
        new RegExp(`${start}[\\S]+${end}`)
    )

    // r.keywords.forEach( (keyword, i)=>{
    //     if( i < r.keywords.length -1 ){
    //         let nextKeyword = r.keywords[ i + 1 ]
    //         let regex = matchVarsRegex( utils.escapeRegExp(keyword), utils.escapeRegExp(nextKeyword))
    //         while( (match=regex.exec(found)) !== null ){
    //             console.log(match);
    //         }
    //     }
    // })
    // console.log('foundArr', foundArr)
    let varObj = {}
    // todo
    let varIndex = 0
    if ( r.keywords[0] === foundArr[0] ){
        varIndex = -1
    }

    // console.log('foundArr', foundArr)

    // should i just use regex?
    // find keyword -> update last keyword -> add current element to the right variable

    // console.log('foundArr', foundArr)
    // console.log(r.vars)


    let adjIndex = 0    
    // console.log(`here at     keyword is    next   nextKey    var , vi `)
    foundArr.forEach( (found, i) => {
        // todo 24 6 
        // use index instead of just includes
        let keyword = r.keywords[adjIndex]
        let nextFound = foundArr[i+1]
        let nextKeyword = r.keywords[adjIndex+1]
        // let currentVar = r.vars[ varIndex ]
        
        // console.log(`here at  ${found}   keyword is: ${keyword}   next: ${nextFound}  nextKey:  ${nextKeyword}  var: ${currentVar}, vi: ${varIndex}`)
        if( keyword === found ){
            adjIndex += 1
            // console.log('skipping', varIndex, r.vars[varIndex] , foundArr[i+1] )
            if ( !(nextKeyword === nextFound) ){
                varIndex += 1
                // console.log(`[varInc] ${varIndex} ${r.vars[varIndex]} keys: ${keyword} ${nextKeyword} found: ${found} ${nextFound}`)
            }
        }else{
            if( varObj[ r.vars[varIndex] ] ){
                varObj[ r.vars[varIndex] ] += found 
            }else{
                // console.log('Created', varIndex, r.vars[varIndex], '->', found)
                varObj[ r.vars[varIndex] ] = found 
            }
        }
    })

    console.log( 'varObj', varObj )
    // let foundMatches = r.indexes.map( el => foundArr[el] )
    // foundMatches.forEach( (match, i) => varObj[ r.vars[i] ] = match )

    obj = { vars: varObj }
    return callback( obj )
}
// console.log( ruler(found, rule) )

exports.ruleListComper = ruleListComper = function(found) {
    console.log('-'.repeat(22))
    // console.log('[received]', found)
    found = found.trim()
    
    return ruler( found, rule, (obj) => {
        // console.log('[comper] ', obj)
return `${obj.vars.array}.map( function(${obj.vars.var}){
    return (${obj.vars.varSpec})
})
`       }
    )
}
exports.forDots = forDots = function(found) {
    console.log('-'.repeat(22))
    console.log('[received]', found)
    found = found.trim()
    let rule = `for( {{start}}...{{end}} ){ {{code}} }`
    return ruler( found, rule, (obj) => {
        // return obj
return `for(let i=0; i<){
${obj.vars.code}
}`
    })
}

rules = []


exports.decideRule = function (found) {
    console.log( getRule( found ) )
}
// console.log(
//     forDots(`for(1...10) {
//         console.log("Boo!") 
//     }`)
// )
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

// module.exports = {ruleListComper}


// packed = {
//     rule: rule,
//     function: ruleListComper,
// }

// let listPacked = ruler(rule, callback)
// console.log()

// ruler => rule, callback, pre => { (found) => sourceCode }