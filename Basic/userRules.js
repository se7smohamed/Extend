// user created rules

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
    }
]