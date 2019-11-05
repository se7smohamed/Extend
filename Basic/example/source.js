let array = [
    [
        [1,2,3,4,5],
        [1,2,3,4,5],
        [1,2,3,4,5],
        [1,2,3,4,5],
        [1,2,3,4,5],
    ],[
        [1,2,3,4,5],
        [1,2,3,4,5],
        [1,2,3,4,5],
        [1,2,3,4,5],
        [1,2,3,4,5],
    ]
]

console.log( array[1][2][array[1][2].length-2] )

f = function(args) {
    let defaults = {"arg1":null,"arg2":"111","arg3":"{}","arg4":null}
    let keys = ["arg1","arg2","arg3","arg4"]
    Object.assign( defaults, args )
    for( let i=0; i<keys.length; i++ ) {
        prop = keys[i]
        if(defaults[prop]===null){
            this[prop] = defaults[i]
        }else{
            this[prop] = defaults[prop]
        }
    }
    //console.log(this.arg1)
}

f({0:2.213,arg3:8,arg4:alert})