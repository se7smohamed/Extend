// todo 
// optional variables and default values

const c = require('./config')
const utils = require('./utils')
let userRules = require('./userRules')

let found = `[ a.x.y.z for a in list ]` // what is expected to be found just for example.
let rule = '[{{varSpec}} for {{var}} in {{array}}]' // the actucal rule that the compiler is looking for.


let getRule = (currRule, s=c.varStartE, e=c.codeEndE) => {

    let varRegEx = new RegExp( `${ c.varStartE }\\w+${ c.varEndE }`,'g' )
    let keywords = []

    let vars = currRule.match(varRegEx)
    if( vars === null ){
        return false
    }
    let varsClean = vars.map( v => v.slice(c.varStart.length, -c.varEnd.length) )

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
    let indexes = varsClean.map( el => ruleArray.indexOf(el.trim()) )
    let obj = {vars: varsClean, array: ruleArray, indexes, keywords}


    return obj
}

let ruler = ( found, rule, callback=()=>{}, pre=a=>a ) => {
    console.log('found:',found, '| rule:' , rule)
    let r = getRule(rule)
    if (!r){
        return false
    }
    found = pre(found)
    console.trace('ffffffff',found)
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
    let varObj = {}
    let varIndex = 0
    let adjIndex = 0    

    if ( r.keywords[0] === foundArr[0] ){
        varIndex = -1
    }
    // should i just use regex?
    // find keyword -> update last keyword -> add current element to the right variable

    foundArr.forEach( (found, i) => {
        let keyword = r.keywords[adjIndex]
        let nextFound = foundArr[i+1]
        let nextKeyword = r.keywords[adjIndex+1]
        // let currentVar = r.vars[ varIndex ]
        
        if( keyword === found ){ // found a keyword?
            adjIndex += 1
            if ( !(nextKeyword === nextFound) ){ // check for multiple keywords in row going to the next variable 
                varIndex += 1
            }
        }else{
            // create if !exists
            if( varObj[ r.vars[varIndex] ] ){
                varObj[ r.vars[varIndex] ] += found 
            }else{
                varObj[ r.vars[varIndex] ] = found 
            }
        }
    })
    let run = 1
    r.vars.forEach( variable => {
        if ( varObj[variable] === undefined ){
            console.log(variable, ' undef')
            run = 0
        }
    })
    if (!run){
        console.log('ruler failed')
        return false
    }
    obj = { vars: varObj }
    // console.log(callback.toString())
    return callback( obj )
}


// console.log( ruler(found, rule) )

// exports.ruleListComper = ruleListComper = function(found) {
//     console.log('-'.repeat(22))
//     // console.log('[received]', found)
//     found = found.trim()
    
//     return ruler( found, rule, (obj) => {
//         // console.log('[comper] ', obj)
// return `${obj.vars.array}.map( function(${obj.vars.var}){
//     return (${obj.vars.varSpec})
// })
// `       }
//     )
// }

let ruleHandler = (ruleObj) => {
    return function(found){
        console.log('handler found', found)
        ruleReturn = ruler(found, ruleObj.template, ruleObj.function)
        // if ( ruleReturn ){
            return ruleReturn
        // }

    }
}

// console.log(ruleHandler(userRules.pyList)('[ add$(a.salary) for a in employees]') )

Object.keys( userRules ).forEach( id => {
    let rule = userRules[id]
    userRules[id].function = ruleHandler(rule)
})
// console.log(userRules)



exports.decideRule = decideRule = function (found) {
    console.log('qqqqqqqqqqq',found)
    let result = ruler(found, userRules.pyList.template, userRules.pyList.function)
    if(result){
        return {succ: 1, result }
    }else{
        return {succ: 0}    
    }
}

console.log( decideRule('[ add$(a.salary) for a in employees]') )

// console.log(
//     forDots(`for(1...10) {
//         console.log("Boo!") 
//     }`)
// )

// ruler => rule, callback, pre => { (found) => sourceCode }