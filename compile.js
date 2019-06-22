// white space?
const c = require('./config')
const fs = require('fs')
const rules = require('./rules')
const utils = require('./utils')

let fileName = './source.js.xs'
let source = fs.readFileSync(fileName).toString()
let buildName = fileName.split('.').slice(0, -1).join('.')
const main = () => {
    let whichToLeave = str => {
        let toLeave = []
        let codes = []
        let parts = []
        let re = new RegExp( `${c.codeStartE}.+${c.codeEndE}`,'g' )
        while ((match = re.exec(str)) != null) {
            utils.log('found match ', match, 2)
            let tmp = { 
                s: match.index + c.codeStart.length ,
                e: match[0].length + match.index - c.codeEnd.length ,
                toProcess: 1,
                ls: match.index,
                le: match[0].length + match.index ,
            }
            codes.push( tmp )
        }
        // console.log('[codes]', codes)
        codes.forEach( (el, i) => {
            // first line in file is code to process
            // toleave is curr code end to next code start
            if ( codes[0].s === 0 ){
                toLeave.push( {s: codes[i].le, e: codes[i+1].ls } )
                // parts.push( {s: codes[i].le, e: codes[i+1].ls } )
            }else{
                if ( i===0 ){
                    // parts.push( {s: 0, e: codes[i].ls } )
                    toLeave.push( {s: 0, e: codes[i].ls } )
                } else {
                    // parts.push( {s: codes[i-1].le, e: codes[i].ls } )
                    toLeave.push( {s: codes[i-1].le, e: codes[i].ls } )
                }
                if ( i === codes.length-1 ){
                    // parts.push( {s: codes[i].le, e: str.length } )
                    toLeave.push( {s: codes[i].le, e: str.length } )
                }
            }
        })
        parts = codes.concat(toLeave)
        parts = parts.sort( (a, b) => a.s - b.s )
        return parts
        // return {codes, toLeave}
        // console.log('[codes]', codes, '[toLeave]', toLeave)
    }
    
    processedFile = whichToLeave(source)
    let processed = ''
    
    processedFile.map ( (part, i) => {
        partText = source.slice( part.s, part.e )
        if( part.toProcess ){
            partText = utils.spaceOutTokens( partText )
            // console.log('parttttt', partText)
            processed += rules.ruleListComper(partText)
        }else{
            
            processed += partText
        }        // console.log('part ', part) // console.log('[proc] ', rules.ruleListComper(part))
    })  
    // console.log('[compile.js]',processed)
    witeToFile(processed);
    return processed
}

function witeToFile(processed) {
    fs.writeFile(buildName, processed, (err, x) => {
        console.log('Success.');
    });
}


main()



// let getAllBetween = (word, s, e) => {
//     let toProcess = new RegExp( `${s}.+${e}`,'g' )
//     matches = word.match(toProcess)
//     // return console.log( matches )
//     let cleaned = matches.map( m => m.slice(s.length, -e.length))
//     console.log(cleaned)
//     return cleaned
// }

// console.log( 'axaxaxaxaxax'.getIndexes('ax') )
// let cleanFile = str => {
    //     let indexes = str.getIndexes('_{')
    //     // console.log('indexes', indexes)
    //     let parts = { array: []}
    //     parts.compileFirst = 0
    //     indexes.forEach( (index, i, arr)=>{
    //         // console.log(index)
    //         if( i===0 ){
    //             if( str.slice(0, index) === '' ){
    //                 parts.compileFirst = 1
    //                 parts.array.push( str.slice(0, index) )
    //             }
    //         }
    //         parts.array.push( str.slice( arr[i-1], index ) )
    //     })
    //     return parts
    // }
    