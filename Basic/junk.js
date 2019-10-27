
// first off extract code {{ CODE }}
const extractCode1 = (arr) => {
//  look though array of objs
    let bracesDepth = 0
    for (let i = 0; i < arr.length; i++) {
        let block = arr[i];
        if(block.type===0){
            for (let j = 0; j < block.str.length; j++) {
                let letter = block.str[j];
                if(letter==='{' ){ 
                    if(bracesDepth % 2){
                        bracesDepth++
                    }else{
                        bracesDepth--
                    }
                }
                else if(letter==='}' ){ 
                    if(bracesDepth % 2){
                        bracesDepth--
                    }else{
                        bracesDepth++
                    }
                }
                if(bracesDepth){}
            }
        }
    }
    return bracesDepth
}



if(isString){
    let str = ''
    for(let block of blocks){
        if(block.letter){
            str += block.letter + block.str + block.letter 
        }else{
            str += block.str
        }
    }
    return str
}



exports.stringFuncNumbers = (str, execluding, dir=true, nested=false, initial=0, isNested=false) => {
    // function that looks at execluding(array strings) and returns 2d array  [ [start, end], []... ]
    var skipI = []
    var list = []
    var stringDepth = 0
    let count = 0
    for(let i=0; i<str.length; i++){
        let letter = str[i]
        // if(i && isNested){return list}
        if(skipI.includes(i) ){ continue }
        if(dir){
            var hasMatch = this.matchAny(str.slice(i), execluding.slice(0), dir)
            // console.log(count, execluding.slice(count))
        }else{
            var hasMatch = this.matchAny(str.slice(i), execluding, dir)
        }
        if(hasMatch.match){
            // if(count>=execluding.length){count=0}
            console.log(str.slice(i, i+4))
            for(let j=i;j<hasMatch.length+i;j++){
                skipI.push( j )
            }
            if(stringDepth){
                if(str.slice(i, i+strChar.length) === strChar || (letter === '\n' && strChar!=='`' && !dir)){
                    strChar = ''; stringDepth--;
                    // count--
                    // console.log(i, str.slice(i,i+5), stringDepth, str.slice(i, i+strChar.length) === strChar, count)
                    list[count] = (list[count]||[])
                    list[count][1] = i
                }else{
                    // let res = this.stringFuncNumbers(str.slice(i), execluding, dir, false, i, true)
                    // res.length && console.log('rrr', res, `'${str.slice(...res[0])}'`)
                }
            }else{
                // strChar = letter; 
                stringDepth++
                count++
                if(dir){
                    strChar = execluding[1]
                }
                list.push([ i+execluding[0].length, '' ])
                startedAt = i
            }
        }
    }
    // console.log(list.length)
    // return list.length ? list : [[0,0], [0,0]]
    return list
}



exports.matchAny = (str, needles) => {
    for(let i = 0; i < needles.length; i++){
        if(str.slice(0, needles[i].length)===(needles[i])){
            return { match: true, length: needles[i].length, }
        }
    }
    return {match: false}
}

exports.levelFunc = (str, execluding) => {
    var list = [{str:''}]
    var stringDepth = 0
    var skipI = []

    for(let i=0; i<str.length; i++){
        letter = str[i]
        if(skipI.includes(i) ){ continue }

        if(str.slice(i, i + execluding[0].length)===execluding[0]){
        
            stringDepth++
            str = str.slice(execluding[0].length-1)
            list.push({str: '', level:stringDepth})
            for(let i=0;i<execluding[0].length;i++){skipI.push(i)}

        }else if(str.slice(i, i + execluding[1].length)===execluding[1]){
        
            stringDepth--
            str = str.slice(execluding[1].length-1)
            list.push({str: '', level:stringDepth})
            for(let i=0;i<execluding[1].length;i++){skipI.push(i)}

        }else{
            list[list.length-1].str += letter
        }
    }
    return list
}


exports.stringFunc = (str, execluding) => {
    var skipI = []
    var list = []
    var stringDepth = 0
    for(let i=0; i<str.length; i++){
        let letter = str[i]
    
        if(skipI.includes(i) ){
            if(!stringDepth) {list[list.length-1].letter += letter}
            continue
        }

        let hasMatch = this.matchAny(str.slice(i), execluding)
        // console.log(str.slice(i), hasMatch.match)
        if(hasMatch.match){
            for(let j=i;j<hasMatch.length+i;j++){
                skipI.push( j )
            }
            // i===0 && list.push({str:'', letter, type: 0})
            if(stringDepth){
                if(letter === strChar || (letter === '\n' && strChar!=='`')){
                    strChar = ''; stringDepth--;
                }
                list.push({str:'', type: stringDepth})
            }else{
                strChar = letter; stringDepth++
                list.push({str: '', letter, type: stringDepth})
            }
        }else{
            i===0 && list.push({str:'', type: stringDepth})
            list[list.length-1].str += letter
        }
    }
    return list
}

// console.log(txtt[31])
// gett = stringFunc(txtt , ['"', '"', '`'], 0)
// recc = reconstruct( gett, 1 )
// console.log( `mine| ${recc}\ntext| ${txtt}`, recc===txtt )
// txtt = code
// gett = this.stringFunc(txtt , ['"', "'", '`'])
// recc = this.reconstruct( gett, 1 )
// console.log(gett) 
// console.log( `mine| ${recc}\ntext| ${txtt}`, recc===txtt )


exports.extracteur = (str, execluding, extract=true, nested=false, initial=0, isNested=false) => {
    // function that looks at execluding(array strings) and returns 2d array  [ [start, end], []... ]
    const find = (str, needle, i) => (str.slice(i,i+needle.length)===needle)
    const findAny = (str, needles, i) => needles.some(needle => (str.slice(i,i+needle.length)===needle))
    const handle = str => '&'+str+'&'
    let value = ''
    var skipI = []
    var list = []
    let doneCodes = 0
    let isOpened = false 
    let accum = ''
    let xhildren = []
    for(let i=0; i<str.length; i++){
        let letter = str[i]
        if(skipI.includes(i) ){ continue }
        if(extract){
            if(find(str, execluding[0], i) && !isOpened){
                skipI.push(execluding[0].length + i - 1)
                // list[doneCodes] = list[doneCodes] || []
                // list[doneCodes][0] = i + execluding[0].length + initial
                isOpened = true
            }else if(find(str, execluding[1], i)&&isOpened){
                // if(str.slice(i,i+2)=='}}'){
                //     console.log('object')
                // }
                // skipI.push(execluding[1].length + i + 1)
                // value += 
                // list[doneCodes] = list[doneCodes] || []
                // list[doneCodes][1] = i + initial
                doneCodes++
                isOpened = false
                console.log('accc', str.slice(i-3, i+3))
                return accum
            }else if(find(str, execluding[0], i)){
                let res = this.extracteur( str.slice(i), execluding, extract, nested, i, isNested )
                for (let j = 0; j < execluding[1].length; j++) {
                    skipI.push(i+1, i+j+1)
                }

                // console.log('acc', res)
                xhildren.push(res)

            }else if(isOpened){
                accum += letter
            }else{
                value += letter
            }
        }
    }
    value += handle(accum)
    value.xxx = xhildren
    console.log(value.xxx)
    return value
}





exports.reconstructCode = (str, anal) => {
    let ret = ''
    for (let i = 0; i < anal.length; i++) {
        const code = anal[i];
        ret += (str.slice(code[0], code[1]))
        if(code.children){
            console.log('nested', this.reconstructCode(str, code.children) )
            ret +=  this.reconstructCode(str, code.children) + '____'
        }
    }
    return ret
}

// console.log( 
//     // ':- ',
//     // txtt.slice(
//     //     ...
//     // util.inspect(
//         // this.reconstructCode(
//             // txtt, 
//             this.extracteur(txtt, ['{{','}}'], '','', true)
//         // )
//     //     ,{showHidden: false, depth: null}
//     // )
//     //     [0]
//     // )
//     // ,'"'
// )
