// todo 
// optional variables and default values
// array variables?
const c = require('./config')
const utils = require('./utils')
let userRules = require('./userRules')
let verify = require('./verifyRule')
let foundExample = `[ a.x.y.z for a in list ]` // what is expected to be found just for example.
let ruleExample = '[{{varSpec}} for {{var}} in {{array}}]' // the actucal rule that the compiler is looking for.

let parseRule = (currRule, s=c.varStartE, e=c.codeEndE) => {
    let keywords = []
    let varRegEx = new RegExp( `${ c.varStartE }\\w+${ c.varEndE }`, 'g' )
    let currRuleNoBrases = currRule

    let vars = currRule.match(varRegEx)
    if( vars === null ){ return false }

    let varsNoBraces = vars.map( variable => variable.slice(c.varStart.length, -c.varEnd.length) )
    
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
let parseAllRules = () => (
    Object.keys( userRules ).map( id => {
        let parsed = parseRule(userRules[id].template)
        userRules[id] = {...userRules[id], ...parsed}
        let verified = verify.verify( userRules[id] )
        if (!verified.succ){
            console.log(
                `An error has occured while paring rule \n${id}: "${userRules[id].template}"\n`,
                verified.errors.map( err => '* ' + err.msg ).join('\n')
            )
        }
        return verified
    })
)

exports.applyRule = applyRule = (found, rule, callback=()=>{}, pre=a=>a ) => {
    console.log('coming for', found, rule.template)
    found = pre(found)
    found = found.unspace()
    foundArr = found.split(' ')
    // console.log(rule.template, rule.keywords)
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
    // console.log('varObj is: ', varObj)
    rule.vars.forEach( variable => {
        if ( varObj[variable.str] === undefined ){
            // console.log(variable.str, 'undef')
            run = 0
        }
    })
    if (!run){
        return false
    }
    obj = { vars: varObj }
    let result = callback( obj )
    if( typeof result === 'string' ){
        return result + '\n\n'
    } 
    return result
}

exports.checkRule = checkRule = function (found, ruleObj) {
    let result = applyRule(found, ruleObj.template, ruleObj.function)
    if(result){
        return {succ: 1, result }
    }else{
        return {succ: 0}
    }
}

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

// stop if any rule failed
if ( parseAllRules().some( el => el.succ != 1) ){
    // process.exit()
}
lookForRuleSettings = {}
// Object.
let userRulesArray = Object.keys(userRules).map( key => userRules[key])

exports.recursiveLookForRule = recursiveLookForRule = string => {
    ///////
    // let strArrayChanged = string.unspace().split(' ')
    let strArrayChanged = string.unspace().splitKeep(' ')
    let processed = ''
    // console.log(strArrayChanged)
    while(strArrayChanged.length){
        let i = 0
        let wordFull = strArrayChanged[i]
        let word = wordFull.trim()
        let foundResult = lookForRule(strArrayChanged, word, i)
        if(foundResult.succ){
            let foundString = strArrayChanged.slice(foundResult.startingIndex, foundResult.endingIndex).join(' ')
            let applied = applyRule(foundString, foundResult.rule, foundResult.rule.function)
            if(applied){
                console.log('recursive', string.slice(0,28), '...')
                processed += applied
                strArrayChanged = strArrayChanged.slice(0, foundResult.startingIndex).concat( strArrayChanged.slice(foundResult.endingIndex) )
                return processed
            }
        }

        // todo
        // rewrite this garbage
        // let symbols = ["'", '"', '`']
        // let open = false
        // if( symbols.includes(word) && !open) {
        //     open = true
        //     let foundSymbol = word
        //     let fullString = word
        //     let original = i
        //     while( true ){
        //         if(word === foundSymbol){
        //             // found closing char
        //             // we are done
        //             if (original === i-1){continue}
        //             open = false;
        //             break 
        //         }else{
        //             // in the string
        //             // word = next word (increment i) || break
        //             wordFull = strArrayChanged[i+1]
        //             word = wordFull.trim()
        //             if(word === undefined){ break }
        //             // original = old then it's opening quote so no space
        //             // add first just for testing
        //             if (original === i-1){
        //                 fullString += '#01!!' + wordFull
        //             }
        //             else{ fullString += '(' + wordFull }
        //         }
        //     }
        //     processed += fullString + ' '
        // }else{
        //     processed += wordFull
        // }
        processed += wordFull
        strArrayChanged = strArrayChanged.slice(1)
    }
    return processed
}

exports.lookForRule2 = lookForRule2 = ( strArray, sentWord, sentIndex ) => {

}
exports.lookForRule = lookForRule = ( strArray, sentWord, sentIndex ) => {
// console.log(strArray.join('-'))
    let matchingRules = userRulesArray.filter( (rule, i) => {
        if( !rule.keywords ) { return false }
        return rule.keywords[0].str === sentWord
    })
    
    // each of the found rules tested word by word retruning an array of fully matched arrays (mainly used keywords here)

    // if(matchingRules.length){
    // console.log(matchingRules)
    // }
    let fullyMatchedRules = matchingRules.map( (currRule, j) => {
        // console.log('mmmmmmmmm', matchingRules)
        
        currentMatching = []
        fullyMatchedTmp = false

        return currRule.keywords.map( (currKeyword, k) => {
            let lastKwI = sentIndex;
            
            while( lastKwI < strArray.length ){
                if ( strArray[lastKwI] === currKeyword.str ){
                    // console.log('here')
                    // let isNested = recursiveLookForRule(strArray.slice(1).join(' '), strArray[lastKwI+1], lastKwI+1)

                    // if( isNested.succ ){
                    //     console.log('is indeed', sentWord, applyRule( strArray[lastKwI+1], isNested.rule, isNested.rule.function ))
                    // }
                    // console.log('matched: ', currKeyword.str, strArray[lastkeywordIndex], lastkeywordIndex)
                    currentMatching.push( currKeyword.str )
                    break
                }
                lastKwI += 1
            }
            if ( currentMatching.length === currRule.keywords.length ) {
                return fullyMatchedTmp = {
                    rule: currRule,
                    startingIndex: sentIndex,
                    endingIndex: lastKwI + 1
                }
            }else{
                // console.log(currentMatching, currRule.keywords)
            }
        }).filter( el => el !== undefined )[0]
    })

    // if(keyword.includes('.')){
    if ( fullyMatchedRules[0] ){
        return {succ: 1, ...fullyMatchedRules[0]}
    }
    // console.log(fullyMatchedRules)
    return {succ: 0}
}