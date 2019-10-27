// user created rules

exports.rules = [
    {
        id: 'pyArrayNegative',
        template: '{{array}} [ {{n1}} ]',
        output: function({array, n1}){
            if(n1<=0){
                return `${array}[${n1}]`
            }
            return `${array}[${array}.length - ${n1}]`
        }
    },
    {
        id: 'minusArrowFunction',
        template: '({args}) -> {{code}}',
        output: function({args, code}){
            return `(${args}) => ${code}`
        }
    }
]