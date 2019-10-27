const userRules = require('./userRules')
const parse = require('./parse')

var symbolsArray = '\'"\\/,`!@#$%^&*+-;:?><=[]{}().'.split('')

// parseRule
// temps:
// "loop {{i}} to {{e}} "
// list: [loop i to e]

let terminals = ['{', '}']
let t = terminals
let escapeChar = '#'

const parseTemp = (temp, findVars=true) => {
    let array = [{value:''}]
    let skipI = []

    let inVar = false

    for (let i = 0; i < temp.length; i++) {
        const letter = temp[i];
        let last = array.length ? array[array.length-1] : array[0]
        if(skipI.includes(i)){last.value = (last.value||'')+letter;}
        if(letter === escapeChar){
            skipI.push(i+1)
            continue;
        }
        if( t[0] === letter && findVars){
            inVar = true
            array.push({value: '', type: 'var'})
            continue
        }
        else if( t[1] === letter && findVars){
            inVar = false
            array.push({type:'word', value: ''})
            continue
        }
        if(inVar && findVars){
            if (!letter.match(/\s/)){
                last.value += letter 
            }
        }else{
            if(symbolsArray.includes(letter)){
                array.push({
                    value: letter,
                    type: 'symbol'
                })
                array.push({})
            }else if(letter.match(/\s/)){
                array.push({})
            }
            else{
                last.value = (last.value||'')+letter;
                last.type = 'word'
            }
        }

    }
    array.forEach((w, i) => {
        if(array[i].value){
            return array[i].value.trim()
        }
    })
    return array.filter((w, i) => Object.keys(w).length && w && w.value )
}

// next up selecting group and non required / default values
let temp = ` word word word {array}[{n}]`
// console.log( parseTemp(temp),'from runrules' )
// console.log(userRules)
// console.log( parseTemp(userRules.rules[0].template),'from runrules' )
// console.log( parseTemp('array [22]', false), 'xx' )

exports.parseTemp = (str) => parseTemp(str, true)
exports.parseCode = (str) => parseTemp(str, false)
// console.log(( splitChars(temp, ['{', '}']) ))


// console.log(
//     splitWords( 
//         splitChars(temp)
//     )
// )
// console.log(
//     splitChars('ajdhjs a#fl; !@#h ')
// )

// let x = [1,2,3,4]
// var last = {{ x[-2] }}
// var even = {{ numbers[::2] }}
// {{
//     loop i < array.length {

//     }
// }}

// odds = {{ [ a for a in lst if a%2 ] }}
// xxxx = '[ {{var}} for {{var}} in {{arr}} if {{cnd}} ]'

// for (let i=0; i<rules.length; i++){
    
// }