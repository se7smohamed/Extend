const c = require('./config')
const utils = require('./utils')

let varParser = ({
    variable = '',
    before = a=>a,
    after = a=>a
  }={}) => {
    varArray = variable.split('?')
    if( varArray.length === 1 ) {
        return {
            value: varArray[0],
            required: true
        }
    }else if( varArray.length === 2 ) {
        return {
            value: varArray[0],
            required: false
        }
    }else{
        return {
            value: varArray[0],
            required: false,
            default: varArray[2]
        }
    }
    // switch (varArray) { //     case 1: // case 2: // case 3: //     return { //         value: variable, //         required: false //     } // }
}

let forDotsFunction = obj => `for(let i=0; i<){
    ${obj.vars.code}
}`

let pyListFunc = obj => {
    // let run = true
    //['array', 'var', 'varSpec']
let code = `${obj.vars.array}.map( function(${obj.vars.var}){
    return (${obj.vars.varSpec})
})`
    return(code)
}

rules = {
    forDots: {
        template: `for( {{start}}...{{end}} ){ {{code}} }`,
        function: forDotsFunction, 
    },
    pyList: {
        template: `[{{varSpec}} for {{var}} in {{array}}]`,
        function: pyListFunc, 
    },
    varParser: {
        function: varParser
    }
}

module.exports = rules