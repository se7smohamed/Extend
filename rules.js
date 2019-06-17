let settings = {
    splitStart: '{{',
    splitEnd: '}}',
    existStart: '[[',
    existEnd: ']]'
}

module.exports = ruler = (str, rule) => {
    let obj = {}
    let split = str.split( settings.splitStart ).slice(1).map( el => {
        let tmp
        if (el.split('.').length > 0){
            return tmp = el.split('.')[0].split( settings.splitEnd )[0]
        }
        tmp = el.split( settings.splitEnd )[0]
        return tmp
    })
    Object.assign(obj)
    console.log(split)
}

pythonStrTarget = `[a.x for a in lst]`
pythonStrRule = ruler( `[ [[a.x]] for {{a}} in {{lst}} ]`, (els, eval)=> els.lst.foreach( a => a ) )



// let getBetween = (word, start, end) => {
//     arr = word.split(start).map( el => {
//         return el.split(end)
//     })
//     return arr
//     // return arr.map( el => {
//     //     if ( Array.isArray(el) ){
//     //         return el[0]
//     //     }
//     // })
// }
// console.log( getBetween( 'extra1 extra 2{var1} extra 3{var2}', '{', '}' ) )
