// todo 
// optional variables and default values
// array variables?
const c = require('./config')
const utils = require('./utils')
let userRules = require('./userRules')
let verify = require('./verifyRule')
let found = `[ a.x.y.z for a in list ]` // what is expected to be found just for example.
let rule = '[{{varSpec}} for {{var}} in {{array}}]' // the actucal rule that the compiler is looking for.


// i'll just leave this here.
// let openCloseStack = []
// let openCloseChars = '[],{},(),\'\',"",``'.split(',')
// let skippedStrings = []
// let skipStrings = (string) => {
//     return
// }
// let isBalanced = (str)=>{}
// let openCloseBalance = (string, openCloseChars=openCloseChars)=>{
//     string = string.split('')
// }

let getRule = (currRule, s=c.varStartE, e=c.codeEndE) => {
    let keywords = []
    let varRegEx = new RegExp( `${ c.varStartE }\\w+${ c.varEndE }`, 'g' )
    let currRuleNoBrases = currRule

    let vars = currRule.match(varRegEx)
    if( vars === null ){ return false }

    let varsNoBraces = vars.map( variable => variable.slice(c.varStart.length, -c.varEnd.length) )
    
    // varsNoBraces = varsNoBraces.map( variable => {
    //     let split = variable.split('?', 1)
    //     if( split.length > 1){
    //         return{
    //             original: variable,
    //             required: false,
    //         }
    //     }
    // })
    vars.forEach( (v, i) => currRuleNoBrases = currRuleNoBrases.replaceAll(v, ' ' + varsNoBraces[i] + ' ' ) )

    currRuleNoBrases = currRuleNoBrases.unspace()
    ruleArray = currRuleNoBrases.split(' ')
    ruleArray.forEach( (word, i) => {
        if( !varsNoBraces.includes(word) ){
            keywords.push({
                str: word,
                index: i,
                type: 'keyword',
                req: true
            })
        }
    })

    varsNoBraces = varsNoBraces.map( variable => ({
        str: variable,
        index: ruleArray.indexOf(variable),
        type: 'var',
        req: true
    }))
    
    let obj = {
        vars: varsNoBraces,
        keywords,
        array: ruleArray,
        arrayDetailed: varsNoBraces.concat(keywords).sort( (a, b) => a.index - b.index )
    }

    return obj
}
count = 0
exports.ruler = ruler = (found, rule, callback=()=>{}, pre=a=>a ) => {
    count++
    // if(rule.template==='for( {{start}}...{{end}} ){ {{code}} }'){
    //     console.log('found')
    // }
    // console.log(found)
    // if(count ==1){
    //     console.log(found, rule.template)
    // }
    // console.log('ffffffffffffffffffff', found, 'rrrrrrrrrrrr', rule)
    // let rule = getRule(rule)
    // if (!rule){ return false}
    // console.log('xxxxxxxxxxxxxxxxxxxxxxx', rule)
    found = pre(found)
    found = found.unspace()
    foundArr = found.split(' ')
    rule.keywords.forEach( keywordObj => {
        let keyword = keywordObj.str
        if( !foundArr.includes(keyword) ){
            foundArr.forEach( (found, i) => {
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

    if ( rule.keywords[0].str === foundArr[0] ){
        varIndex = -1
    }
    // should i just use regex?
    // find keyword -> update last keyword -> add current element to the right variable

    foundArr.forEach( (found, i) => {
        let keyword = rule.keywords[adjIndex].str
        let nextFound = foundArr[i+1]
        let nextKeyword =''
        if(rule.keywords[adjIndex+1]){
            nextKeyword = rule.keywords[adjIndex+1].str
        }else{
            nextKeyword = rule.keywords[adjIndex].str
        }
        // let currentVar = r.vars[ varIndex ]
        
        if( keyword === found ){ // found a keyword?
            adjIndex += 1
            if ( !(nextKeyword === nextFound) ){ // check for multiple keywords in row going to the next variable 
                varIndex += 1
            }
        }else{

            // create if !exists
            if( varObj[ rule.vars[varIndex].str ] ){
                varObj[ rule.vars[varIndex].str ] += found 
            }else{
                varObj[ rule.vars[varIndex].str ] = found 
            }
        }
    })
    let run = 1
    rule.vars.forEach( variable => {
        // console.log(variable.str,'objjjjj', varObj[variable.str])
        if ( varObj[variable.str] === undefined ){
            // console.log(variable.str,'objjjjj', varObj, varObj[variable.str])
            // console.log(variable, ' undef')
            run = 0
        }
    })
    if (!run){
        // console.log('ruler failllllllllllllllllllllled')
        // debugger
        return false
    }
    obj = { vars: varObj }
    // console.log(callback.toString())
    let result = callback( obj )
    if( typeof result === 'string' ){
        return result + '\n\n'
    } 
    return result
}

// old unmodified? git???
// let ruler = (found, rule, callback=()=>{}, pre=a=>a ) => {
//     let r = getRule(rule)
//     if (!r){ return false}
//     found = pre(found)
//     found = found.unspace().trim()
//     foundArr = found.split(' ')
//     r.keywords.forEach( keyword => {
//         if( !foundArr.includes(keyword) ){
//             foundArr.forEach( (found, i) => {
//                 let kwIndex = found.indexOf(keyword)
//                 if( kwIndex !== -1 ){
//                     let newFoundArr = [found.slice( 0, kwIndex ), keyword, found.slice( kwIndex+keyword.length )]
//                     foundArr = foundArr.slice(0, i).concat(newFoundArr).concat(foundArr.slice(i+1))
//                 }
//             })
//         }
//     })
//     let varObj = {}
//     let varIndex = 0
//     let adjIndex = 0    

//     if ( r.keywords[0] === foundArr[0] ){
//         varIndex = -1
//     }
//     // should i just use regex?
//     // find keyword -> update last keyword -> add current element to the right variable

//     foundArr.forEach( (found, i) => {
//         let keyword = r.keywords[adjIndex]
//         let nextFound = foundArr[i+1]
//         let nextKeyword = r.keywords[adjIndex+1]
//         // let currentVar = r.vars[ varIndex ]
        
//         if( keyword === found ){ // found a keyword?
//             adjIndex += 1
//             if ( !(nextKeyword === nextFound) ){ // check for multiple keywords in row going to the next variable 
//                 varIndex += 1
//             }
//         }else{
//             // create if !exists
//             if( varObj[ r.vars[varIndex] ] ){
//                 varObj[ r.vars[varIndex] ] += found 
//             }else{
//                 varObj[ r.vars[varIndex] ] = found 
//             }
//         }
//     })
//     let run = 1
//     r.vars.forEach( variable => {
//         if ( varObj[variable] === undefined ){
//             // console.log(variable, ' undef')
//             run = 0
//         }
//     })
//     if (!run){
//         // console.log('ruler failed')
//         return false
//     }
//     obj = { vars: varObj }
//     // console.log(callback.toString())
//     return callback( obj )
// }

exports.checkRule = checkRule = function (found, ruleObj) {
    let result = ruler(found, ruleObj.template, ruleObj.function)
    if(result){
        return {succ: 1, result }
    }else{
        return {succ: 0}
    }
}


// let parseRule = id => {
//     let parsed = getRule(userRules[id].template)
//     userRules[id] = {...userRules[id], parsed}
// }
let parseAllRules = () => (
    Object.keys( userRules ).map( id => {
        let parsed = getRule(userRules[id].template)
        userRules[id] = {...userRules[id], ...parsed}
        let verified = verify.verify( userRules[id] )
        if (!verified.succ){
            // console.log(
            //     `An error has occured while paring rule \n${id}: "${userRules[id].template}"\n`,
            //     verified.errors.map( err => '* ' + err.msg ).join('\n')
            // )
        }
        return verified
    })
)
exports.findAndApply = findAndApply = found => {
    let keys = Object.keys( userRules )
    for(let i=0; i < keys.length; i++){
        let ruleObj = userRules[ keys[i] ]
        let ruleResult = checkRule(found, ruleObj)
        if( ruleResult.succ ){
            return ruleResult.result
        }
    }
    return found
}

// stop if any rule 
// if ( parseAllRules().some( el => el.succ != 1) ){
//     process.exit()
// }
lookForRuleSettings = {}
// Object.
let userRulesArray = Object.keys(userRules).map( key => userRules[key])

exports.lookForRule = lookForRule = ( strArray, keyword, sentIndex ) => {
    // console.log('here')
    keyword = keyword.trim()
    // console.log(strArray, keyword)
    // array of rules with kewyord 0 == found word
    let matchingRules = userRulesArray.filter( (rule, i) => {
        // console.log('here')
        console.log( rule )
        console.log( rule.keywords[0].str, keyword )
        if( !rule.keywords ) { return false }
        
        return rule.keywords[0].str === keyword
    })

    // each of the found rules tested word by word retruning an array of fully matched arrays (mainly used keywords here)
    if(matchingRules.length){
    console.log(matchingRules)
    }
    let fullyMatchedRules = matchingRules.map( (currRule, j) => {
        debugger
        currentMatching = []
        fullyMatchedTmp = false
        return currRule.keywords.map( (currKeyword, k) => {
            // let isNested = lookForRule(strArray, currKeyword, k)
            // if( isNested ){
            //     console.log('nested')
            // }else{
            //     console.log('nah')
            // }
            lastkeywordIndex = sentIndex;
            while( lastkeywordIndex < strArray.length ){
                if ( strArray[lastkeywordIndex] === currKeyword.str ){
                    console.log('matched: ', currKeyword.str, strArray[lastkeywordIndex], lastkeywordIndex)
                    currentMatching.push( currKeyword.str )
                    break
                }
                lastkeywordIndex += 1
            }
            if ( currentMatching.length === currRule.keywords.length ) {
                // console.log('succ')
                // console.log(strArray[sentIndex+1])
                return fullyMatchedTmp = {
                    rule: currRule,
                    startingIndex: sentIndex,
                    endingIndex: lastkeywordIndex + 1
                }
            }
        }).filter( el => el !== undefined )[0]
    })

    // if(keyword.includes('.')){
    if ( fullyMatchedRules[0] ){
        // if(count==1){
            debugger
        // }    
        return {succ: 1, ...fullyMatchedRules[0]}
    }
    return {succ: 0}
}

// let testingString = '[a for a in lst][a for a in lst]'.unspace().split(' ')
// let result = lookForRule( testingString, '[', 0)
// let pffffff = testingString.slice(result.startingIndex, result.endingIndex).join(' ')

// console.log(result.startingIndex, result.startingIndex,'xxxxxx')
// console.log('pffffffffffffffffffff', testingString.slice(result.startingIndex, result.endingIndex))
// console.log(
//     ruler(
//         pffffff,
//         result.rule,
//         // result.rule.function
//         obj => obj
//     )
// )

// console.log(
//     ruler(
//         '[ a for a in lst ]'.unspace(),
//         userRules.pyList,
//         // result.rule.function
//         // obj => obj
//         userRules.pyList.function
//     )
// )
// console.log( userRules.wrong )
// console.log( verify.verify(userRules.wrong) )
// lookForRule()

// let analyzeRule = ruleObj => ruleObj


// console.log( findAndApply(`for(1...10) {
//     console.log("Boo!") 
// }`) )

// console.log(
//     forDots(`for(1...10) {
//         console.log("Boo!") 
//     }`)
// )

// ruler => rule, callback, pre => { (found) => sourceCode }






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

// let ruleHandler = (ruleObj) => {
//     return function(found){
//         console.log('handler found', found)
//         ruleReturn = ruler('fx2', found, ruleObj.template, ruleObj.function)
//         // if ( ruleReturn ){
//             return ruleReturn
//         // }
//     }
// }

// console.log(ruleHandler(userRules.pyList)('[ add$(a.salary) for a in employees]') )

// Object.keys( userRules ).forEach( id => {
    // let rule = userRules[id]
    // userRules[id].function = ruleHandler(rule)
// })
// console.log(userRules)