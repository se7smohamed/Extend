// user created rules

let stringify = obj => {
    let str = '{'
    for (let prop in obj){
        str += prop + ':' + obj[prop] + ','
    }
    str = str.slice(0, -1) + '}'
    return str
}

exports.rules = [
    {
        id: 'pyArrayNegative',
        template: '{{array}} [ {{n1}} ]',
        output: function({array, n1}){
            // conflicting with another rule
            if(n1.includes(',')){
                return false
            }
            if(n1<=0){
                return `${array}[${n1}]`
            }
            return `${array}[${array}.length - ${n1}]`
        }
    }
    ,{
        id: 'minusArrowFunction',
        template: '({args}) -> {{code}}',
        output: function({args, code}){
            return `(${args}) => ${code}`
        }
    },{
        id: 'letToVar',
        template: 'let {var} = {value}',
        output: function(o){
            return `var ${o.var} = ${o.value}`
        }
    },{
        id: 'multiLevelIndex',
        template: '{array}[{indexes}]',
        output: function({array, indexes}){
            try{
                indexes = '[' + indexes + ']'
                indexes = JSON.parse(indexes)
            }catch(e){ 
                return false 
            }
            let code = `${array}[`
            for(index of indexes){
                if(index < 0){
                    code += code.slice(0, -1) + '.length-' + Math.abs(index) + ']['
                }else{
                    code += index + ']['
                }
            }
            code = code.slice(0, -1)
            return code
        }
    }, {
        id: 'forMax',
        template: '{i} to {max}: {code}',
        output: function(o){
            return `for (let ${o.i} = 0; ${o.i} < ${o.max}; ${o.i}++) ${o.code}`
        }
    }, {
        id: 'namedArgumentsDeclare',
        template: 'func({args}){code}',
        output: function(o){
            let args = o.args.split(',')
            let defs = {}
            args.map( (arg, i) => {
                if(arg.includes('=')){
                    defs[arg.split('=')[0]] = arg.split('=')[1]
                }else{
                    defs[arg] = null
                }
            })
            if( o.code[0]==='{' && o.code[o.code.length-1]==='}' ){
                o.code = o.code.slice(1, -1)
            }
return `function(args) {
    var defaults = ${JSON.stringify(defs)}
    var keys = ${JSON.stringify(Object.keys(defs))}
    Object.assign( defaults, args )
    for( var i=0; i<keys.length; i++ ) {
        var prop = keys[i]
        this[prop] = defaults[prop] || defaults[i]
    }
    ${o.code}
}`
        }
    }, {
        id: 'namedArgumentsCall',
        template: '{func}({args})',
        output: function(o){
            let args = o.args.split(',')
            let defs = {}
            args.map( (arg, i) => {
                if(arg.includes('=')){
                    defs[arg.split('=')[0]] = arg.split('=')[1]
                }else{
                    defs[i] = arg
                }
            })
            return `${o.func}(${stringify(defs)})`
        }
    }
]