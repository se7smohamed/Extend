// todo 
// optional variables and default values
// array variables?
const c = require('./config')
const utils = require('./utils')
let userRules = require('./userRules')
let verify = require('./verifyRule')
let foundExample = `[ a.x.y.z for a in list ]` // what is expected to be found just for example.
let ruleExample = '[{{varSpec}} for {{var}} in {{array}}]' // the actucal rule that the compiler is looking for.

let splitChars = (part) => {
    let allChars = '\'"\\/.,`!@#$%^&*+-;:?><=[]{}()'.split('')
    let rest = ''
    let value = [] //[...part.value]
    let chars = [...part]

    for(let char of chars){
        if( allChars.includes(char) ){
            if(value[0]===''){value=[char]; continue}
            rest && value.push(rest)
            rest = '';
            value.push(char)
        }else{
            rest += char
        }
    }
    if(rest){ value.push(rest); rest=''}
    return value
}

let parseRule = (currRule, s=c.varStartE, e=c.codeEndE) => {
    let keywords = []
    let varRegEx = new RegExp( `${ c.varStartE }\\w+${ c.varEndE }`, 'g' )
    let currRuleNoBrases = currRule

    let vars = currRule.match(varRegEx)
    if( vars === null ){ return false }

    let varsNoBraces = vars.map( variable => variable.slice(c.varStart.length, -c.varEnd.length) )
    vars.forEach( (v, i) => currRuleNoBrases = currRuleNoBrases.replaceAll(v, ' ' + varsNoBraces[i] + ' ' ) )

    currRuleNoBrases = currRuleNoBrases.unspace()
    ruleArray = splitChars(currRuleNoBrases)
    // console.log('rrrrrrrrrrrrrrrrrrrrrrrrrr', ruleArray)
    ruleArray.forEach( (word, i) => {
        if( !varsNoBraces.includes(word.trim()) && word !== ''  && word !== ' ' ){
            keywords.push({
                str: word.trim(),
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
        arrayDetailed: varsNoBraces.concat(keywords).sort( (a, b) => a.index - b.index ),
        template: currRule
    }
    // obj.template[0] === 'f' && console.log('oooooooo', obj.vars)
    return obj
}
let parseAllRules = () => (
    Object.keys( userRules ).map( id => {
        let parsed = parseRule(userRules[id].template)
        userRules[id] = {...userRules[id], ...parsed}
        let verified = verify.verify( userRules[id] )
        if (!verified.succ){
            // rmv
            0 && console.log(
                `An error has occured while paring rule \n${id}: "${userRules[id].template}"\n`,
                verified.errors.map( err => '* ' + err.msg ).join('\n')
            )
        }
        return verified
    })
)

exports.applyRule = applyRule = (foundArr, rule, callback=()=>{}, pre=a=>a ) => {
    // found = pre(found)
    // found = found.unspace()
    // foundArr = found.split(' ')
    // console.log(`coming for "${found}"`)
    // console.log(foundArr, rule.keywords.map( k => k.str ))
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

    // foundArr.forEach( (found, i) => {
    // console.log(foundArr.slice(0,11))
    foundArr = foundArr.filter( k => ( k!=='' && k!==' ' ) )
    for (let i = 0; i< foundArr.length; i++){
        // console.log(foundArr.slice(0,11), i, foundArr[i])
        let found = foundArr[i].trim()
        // console.log(`a '${found}' ${i} ${foundArr[i]}`)
        if(found === '' || found === ' '){
            foundArr.splice(i, 1)
        }
        let keyword = rule.keywords[adjIndex].str.trim()
        let nextFound = ''
        if( foundArr[i+1] ){
            nextFound = foundArr[i+1].trim()
        }
        let nextKeyword = ''
        if(rule.keywords[adjIndex+1]){ nextKeyword = rule.keywords[adjIndex+1].str.trim() }
        else{ nextKeyword = rule.keywords[adjIndex].str.trim() }
        // let currentVar = r.vars[ varIndex ]
        // console.log( `xxx '${keyword}' '${found}' `)
        if( keyword === found ){ // found a keyword?
            adjIndex++
            // console.log('nextttttttttttt', foundArr, nextKeyword)
            // if ( (nextKeyword !== nextFound) ){ // check for multiple keywords in row going to the next variable 
            //     varIndex += 1
            // }
            while ( (nextKeyword === nextFound) ){ // check for multiple keywords in row going to the next variable 
                console.log(nextFound, nextKeyword)
                if(rule.keywords[adjIndex+1]){ nextKeyword = rule.keywords[adjIndex+1].str.trim() }
                else{ nextKeyword = rule.keywords[adjIndex].str.trim() }
                nextFound = ''
                if( foundArr[i+1] ){
                    nextFound = foundArr[i+1].trim()
                }
                adjIndex++
            }
        }else{
            // console.log(rule.vars)
            if(found === '' || found === ' '){continue}
            // console.log(`zzzzzzzzzz '${found}' '${keyword}'`)

            // create if !exists
            // console.log('f', `'${found}' '${varIndex}'` )
            console.log('varobj', varIndex)
            let key = rule.vars[varIndex].str
            if( varObj[ key ] ){ // console.log('zzzzzzzzzzzzz', found)
                varObj[ key ] += found 
            }else{
                varObj[ key ] = found 
            }
            varIndex += 1

        }
    }
    let run = 1
    console.log('varObj is: ', varObj)
    rule.vars.forEach( variable => {
        if ( varObj[variable.str] === undefined ){
            console.log(variable.str, 'undef')
            run = 0
        }
    })
    
    if (!run){
        return false
    }

    obj = { vars: varObj }
    let result = callback( obj )
    if( typeof result === 'string' ){
        console.log(result)
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
    let strArray2 = string.splitKeep(' ')
    let processed = ''
    console.log(strArray2)
    while(strArray2.length){
        let i = 0
        let wordFull = strArray2[i]
        let word = wordFull.trim()
        let foundResult = lookForRule(strArray2, word, i)
        // console.log('foundResult', foundResult)
        if(foundResult.succ){
            console.log('here')
            // let foundString = strArrayChanged.slice(foundResult.startingIndex, foundResult.endingIndex).join(' ')
            // let foundString = strArrayChanged.slice(foundResult.startingIndex, foundResult.endingIndex).join('')
            let applied = foundResult.applied //applyRule(foundString, foundResult.rule, foundResult.rule.function)
            if(applied){
                console.log('recursive', string.slice(0,28), '...')
                processed += ' ' + applied
                strArray2 = strArray2.slice(foundResult.start, foundResult.end).concat( strArray2.slice(foundResult.endingIndex) )
                return processed
            }else{
                // console.log('sssssssss')
            }
        }
        processed += wordFull
        strArray2 = strArray2.slice(1)
    }
    return processed
}

exports.lookForRule = lookForRule = ( strArray, sentWord, sentIndex ) => {
    sentWord = strArray[0].trim()
    sentIndex = 0
    // console.log('llllllllllllll', strArray, sentWord, sentIndex )
    let firstWordMatch = userRulesArray.filter( (rule, i) => {
        // console.log(`zzzzzzz "${rule.keywords[0].str}" "${sentWord}"`)
        if( !rule.keywords ) { return false }
        return rule.keywords[0].str.trim() === sentWord
    })

    let lastI = false
    let matchedRules = firstWordMatch.map( (rule) => {
        var keywords = rule.keywords
        let tmpMatchedRules = []
        let tmpRule = keywords.map( (kw, i) => {
            while( i < strArray.length ){
                // console.log(`word '${strArray[i].trim()}' ${kw.str.trim()}'`)
                // console.log('xxxxxx', strArray[i])
                if( strArray[i].trim() === kw.str.trim() ){
                    lastI = i
                    return kw 
                }
                i++;
                lastI = i
            }
        }).filter( e => e )
        if(tmpRule.length === rule.keywords.length ){
            tmpMatchedRules.push(rule)
        }else{
            // console.log('str', tmpRule.map(w=>w.str), '\n', rule.keywords.map(w=>w.str))
        }
        return tmpMatchedRules
    })

    if(matchedRules.length > 1){
        console.log(`Warning: ${matchedRules.length} rules matched. using the last declared rule`)
    }else if(matchedRules.length === 0 ){
        // console.log('zzzzzzz', firstWordMatch)
        return {succ: 0}
    }
    matchedRule = matchedRules[0][matchedRules.length-1]
    if(!matchedRule){
        return {succ: 0}
    }
    

    let applied = applyRule(strArray, matchedRule, matchedRule.function)
    return {
        succ: 1,
        start: sentIndex,
        end: lastI,
        applied
    }
}