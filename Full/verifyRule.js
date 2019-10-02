let msgs = {
    firstVar: "First word in a template cannot be a variable, add a keyword, character, or a symbol at first (working on this).",
    lastVar: "last word in a template cannot be a variable, try adding a semicolon at the end (working on this).",
    twoVars: "Two adjacent words cannot be both variables, add a seperator (a keyword, character, or a symbol) or use one variable instead.",
    sameVar: "Two differnt variables cannot have the same name.",
    // one for duplicate rules
}

exports.verify = verify = ruleObj => {
    let errors = []
    let varNames = []
    // todo
    // let varNameIsSet = 0
    if( !ruleObj.arrayDetailed ){
        console.log(ruleObj)
    }
    if(ruleObj.arrayDetailed[0].type === 'var'){
        errors.push({ msg: msgs.firstVar })
    }
    if(ruleObj.arrayDetailed.slice(-1)[0].type === 'var'){
        errors.push({ msg: msgs.lastVar })
    }

    ruleObj.arrayDetailed.forEach( (el, i, array) => {
        if( i < array.length-1 && array[i].type === 'var' && array[i+1].type === 'var' ){
            errors.push({ msg: msgs.twoVars, details: {var: el, nextVar: array[i+1]} })
        }
        if( varNames.includes( el.str ) ){
            errors.push({ msg: msgs.sameVar, details: {var: el} })
        }
        varNames.push(el.str)

    })

    if(errors.length){
        return {succ: 0, errors}
    }
    return { succ: 1 }
}