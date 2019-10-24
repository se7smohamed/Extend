// todo
// split symb 1
// split words

const rules = require('./userRules')
const parse = require('./parse')


// how parse will work
// extract vars kws and symbols
// array[2] array[x] array[-4]
// {arr} "[" {n} "]" 

// doc
// word is { value:'word', found: ' word', }

// utils
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

String.prototype.splitChar = function (chars) {
    let str = this.valueOf()
    let arr = ['']
    // console.log(str)
    for (let i = 0; i < str.length; i++) {
        let letter = str[i];
        if(chars.includes(letter)){
            arr.push(letter, '')
        }else{
            arr[arr.length-1] += letter
        }
        
    }
    return arr.filter(w=>w.trim())
} 

var symbolsArray = '\'"\\/,`!@#$%^&*+-;:?><=[]{}().'.split('')

const splitChars = (str, symb=symbolsArray) => {
    return str.splitChar(symb)
}

const splitWords = (strArray) => {
    let array = []
    for(let i=0; i<strArray.length; i++){
        let word = strArray[i]
        let broken = word.split(/(?=\s)/)
        broken = broken.map( w => ({value: w.trim(), found: w}))
        // console.log(broken)
        array.push(...broken)
        // strArray.splice(i,1)l
        // console.log(strArray,broken)
        // if(broken.length>1){
        //     strArray.splice(i, 0, ...broken)
        // }
    }
    return array
}


// parseRule
// temps:
// "loop {{i}} to {{e}} "
// list: [loop i to e]

let terminals = ['{', '}']
let t = terminals
let ts = ['\\{', '\\}']
let symbs = ['?']
let escapeChar = '#'

const parseTemp = (temp) => {
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
        if( t[0] === letter ){
            inVar = true
            array.push({value: '', type: 'var'})
            continue
        }
        else if( t[1] === letter ){
            inVar = false
            array.push({type:'word', value: ''})
            continue
        }
        if(inVar){
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
console.log( parseTemp(temp),'xxx' )
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