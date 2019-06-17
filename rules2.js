let found = `[ a.x.y.z for a in list ]`
let rule = '[ [fst] for [snd] in [list] ]'
const utils = require('./utils')
let c = {
    start: '[',
    end: ']',
}

// let getBetween = (word, s=c.start, e=c.end) => {
//     let r = new RegExp( `(\\${s}\\S+\\${e})`,'g' )
//     matches = word.match(r)
//     cleaned = matches.map( m => m.slice(1,-1))
//     return match
//     // let dyns = [], all = [] // beforeLst = word.split(c.start) // console.log(beforeLst) // beforeJoined = beforeLst.join('') // dyns = beforeLst.slice(1).join('').split(c.end) // word = beforeJoined.split(c.end).join('') // return [all, dyns]
// } // console.log( getBetween('static1 [dyn1] static2 [dyn2]') )

let getRule = (word, s=c.start, e=c.end) => {
    let r = new RegExp( `(\\${s}\\S+\\${e})`,'g' )
    wordArr = word.split(/\s+/)
    console.log(word, word.split(/[\s+\[\]]]/))
    matches = word.match(r)
    cleaned = matches.map( m => m.slice(1,-1))
    // console.log(wordArr)
    let indices = matches.map( match => wordArr.indexOf(match) )
    return {matches, indices}
}

let ruler = ( found, rule, callback ) => {
    let r = getRule(rule)
    let ruleMatches = r.matches
    let ruleIndices = r.indices
    foundArr = found.split(/(\s+|\\{|\\})/)
    // foundArr = found.split(/\s/) ' '
    // console.log(foundArr)
    let foundMatches = ruleIndices.map( el => foundArr[el] )
    // console.log(ruleIndices, foundMatches)
    obj = {ruleMatches, foundMatches}
    // let tmp = names.forEach( (name, i) => obj[name] = foundMatches[i] )
    // Object.assign(obj, tmp)
    // console.log(obj)
    return callback(obj)
}

let ruleListComper = function(found) {
    found = found.trim()
    return ruler( found, rule, (obj) => {
return `${obj.foundMatches[2]}.map( function(${obj.foundMatches[1]}){
    return (${obj.foundMatches[0]})
})

`
    })
}


module.exports = {ruleListComper}