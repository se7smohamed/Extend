// Basic attempt using mustache syntax
const runRules = require('./userRules')

let terminals = ['{{', '}}']
let quotes = ['"', "'", '`']


let nestedHELP = (str, anal) => {
    // 
    // aaaaaaaaaaaaaaa {{ letter xxx {{ letter y }} }}
    // aaaaaaaaaaaaaaa
    // {
    // {
        // if i & i-1 in anal
            // send to self
                // letter xxx
                // {
                // {
                    // send to self 
                        // letter y
                        // }
                        // }
                        // return p_y
                // return z_xxx p_y
}


exports.extracteur = (str, exeluding, strings, depth=0) => {
    const find = (str, needle, i) => (str.slice(i,i+needle.length)===needle)
    const findAny = (str, needles, i) => needles.some(needle => (str.slice(i,i+needle.length)===needle))
    const range = (s, e) => {
        let array = []
        for (let i = s; i < e; i++) { array.push(i) }
        return array
    }
    const handle = (str, i) => {
        console.log(`handling "${str}"`)
        return '('+str+')'
    }
    var skipI = []
    var isOpen = false
    
    var accum = ''
    var block = {
        final: '',
        children: [],
        finals: [],
    }
    for (let i = 0; i < str.length; i++) {
        if(skipI.includes(i)){ 
            // console.log('skip', str[i]);
            continue;
        }
        // console.log(skipI)
        let letter = str[i];
        let foundOpen = find(str, exeluding[0], i)
        let foundClose = find(str, exeluding[1], i)
        if( foundOpen ){
            // console.log(str, i)
            var res = this.extracteur(str.slice(i+exeluding[0].length), exeluding, '', depth+1 )
            // console.log(res.final)
            // block.children.push( res )
            // block.finals.push( res.final )
            res.final ? block.final += handle(res.final, depth) : null
            skipI.push( ...range(i, i + res.len + exeluding[1].length ) )
        } else if(foundClose){
            skipI.push( [i, i + exeluding[1].length] )
            accum ? block.final += handle(accum) : 0            
            block.len = i
            return block
        } else if(isOpen) {
            accum += letter
        }else if(!isOpen){
            block.final += letter
        }
    }
    accum ? block.final += handle(accum) : 0
    return block
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



// let code = `aa 'asd' asd`
txtt = 'Hay {{code}}'
txtt = '"as`d"a"`s"'
txtt = `t0 {{ t1 {{ t2 }} }}`


console.log( 
    // ':- ',
    // txtt.slice(
    //     ...
    // util.inspect(
        // this.reconstructCode(
            // txtt, 
            this.extracteur(txtt, ['{{','}}'])
        // )
    //     ,{showHidden: false, depth: null}
    // )
    //     [0]
    // )
    // ,'"'
)