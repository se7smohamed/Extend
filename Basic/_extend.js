
let stringify = obj => {
    let str = '{'
    for (let prop in obj){
        str += prop + ':' + obj[prop] + ','
    }
    str = str.slice(0, -1) + '}'
    return str
}
    
module.exports.rules = [
    {
        id: 'arrayComprehension',
        template: '#[ {{el}} for {{elName}} in {{array}} #]',
        output: function({array, el, elName}){
            return `${array}.map( ${elName}=> ${el})`
        }
    }, {
        id: 'pyArrayNegative',
        template: '{{array}} #[ {{n1}} #]',
        output: function({array, n1}){
            // conflicting with another rule
            if(n1.includes(',')){
                return false
            }
            if(n1>=0 || isNaN(n1)){
                return `${array}[${n1}]`
            }
            return `${array}[${array}.length${n1}]`
        }
    },{
        id: 'multiLevelIndex',
        template: '{array}#[{indexes}#]',
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
            if(!(o.args && o.code)){
                return false
            }
            let args = o.args.split(',')
            let defs = {}
            args.map( (arg, i) => {
                if(arg.includes('=')){
                    defs[arg.split('=')[0].trim()] = eval(arg.split('=')[1])
                }else{
                    defs[arg] = null
                }
            })
            if( o.code[0]==='{'){
                o.code = o.code.slice(1)
            }
            if( o.code[o.code.length-1]==='}' ){
                o.code = o.code.slice(0, -1)
            }
return `function(args) {
    var values = ${JSON.stringify(defs)}
    var keys = Object.keys(values)
	for(let prop in args){
		if(isNaN(prop)){ values[prop] = args[prop]}
		else{values[keys[prop]] = args[prop]}
    }
    for( var i=0; i<keys.length; i++ ) {
        this[keys[i]] = values[keys[i]]
    }
    ${o.code}`
        }
    }, {
        id: 'namedArgumentsCall',
        template: '{func}({args})',
        output: function(o){
            if(! (o && o.func) ){
                return false}
            let args = o.args || ''
            args = args ? args.split(',') : []
            // console.log(args)

            let defs = {}
            if(!/^[a-zA-Z]*$/.exec(o.func)){
                return false
            }
            args.map( (arg, i) => {
                if(arg.includes('=')){
                    defs[arg.split('=')[0]] = arg.split('=')[1]
                }else{
                    defs[i] = arg
                }
            })
            let argsStr = Object.keys(defs).length ? stringify(defs) : ''
            return `${o.func}(${argsStr})`
        }
    }, 
    {
        id: 'operatorOverLoading',
        template: '{expression}',
        output: function(o){
            var hasAny = (str, needles) => {
                return needles.filter(needle => str.includes(needle));
            }
            var splitByAny = (str, needles) => {
                let array = ['']
                str.split('').forEach((char, i) => {
                    if(needles.includes(char)){
                        if(array[array.length-1]){
                            return array.push(char, '')
                        }
                        return array[array.length-1] += char
                    }
                    return array[array.length-1] += char
                });
                return array
            }
            var has = []
            if( (o && o.expression) ){
                has = hasAny(o.expression, '+-/*'.split(''))
                if(!has.length) {return false}
            }else{
                return false
            }
            let operObject = {
                '+': '_add_',
                '-': '_sub_',
                '*': '_mul_',
                '/': '_div_'
            }
            var split = splitByAny(o.expression, '+-/*'.split(''))
            let value = ''
            split.forEach( (el, i) => {
                if(i%2){ // opertaion + /
                    let operator = el
                    let operation = operObject[operator]
                    let b4 = split[i-1]
                    let after = split[i+1]
                    if(i===1){ value += `${b4}.${operation}(` }
                    if(split.length===3){ return value += `${after})`}
                    if(i===1 && split.length !== 3){ return }
                    if(i===split.length-2){ return value += `${b4}).${operation}(${after})` }
                    return value += `${b4}).${operation}(${after}`
                }
            })
            return value
        }
    }
]
