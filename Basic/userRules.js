// user created rules

exports.rules = [
    {
        id: 'pyArraySlice',
        template: '{{array}} [ {{n1?0}} ]',
        output: function({array, n1}){
            if(n1<=0){
                return `${array}[${n1}]`
            }
            return `${array}[${array}.length - ${n1}]`
        }
    }
]