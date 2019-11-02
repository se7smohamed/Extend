var symbolsArray = '\'"\\/,`!@#$%^&*+-;:?><=[]{}().'.split('')
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
        if(skipI.includes(i)){
            console.log(temp[i-1], temp[i],temp[i+1])
            last.value = (last.value||'')+letter;
            continue
        }
        if(letter === escapeChar){
            skipI.push(i+1)
            continue;
        }
        if( t[0] === letter && findVars ) {
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
            if (letter.match(/\s/)){
                carriedSpace = letter
            }else{
                last.value += letter 
            }
        }else{
            if(symbolsArray.includes(letter)){
                array.push({
                    value: letter,
                    type: 'symbol',
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
    return array.filter((w) => Object.keys(w).length && w && w.value )
}

exports.parseTemp = (str) => parseTemp(str, true)
exports.parseCode = (str) => parseTemp(str, false)