let array = [
    [ [1,2,3,4,5], [1,2,3,4,5], [1,2,3,4,5], [1,2,3,4,5], [1,2,3,4,5] ],
    [ [1,2,3,4,5], [1,2,3,4,5], [1,2,3,4,5], [1,2,3,4,5], [1,2,3,4,5] ]
]

console.log( array[1][2][array[1][2].length-2] )

myFunction = function(args) {
    var defaults = {"arg1":null,"arg2":"111","arg3":null,"arg4":null}
    var keys = ["arg1","arg2","arg3","arg4"]
    Object.assign( defaults, args )
    for( var i=0; i<keys.length; i++ ) {
        var prop = keys[i]
        this[prop] = defaults[prop] || defaults[i]
    }
    console.log(this.arg4)
}

myFunction({0:2.213,arg3:8,arg4:'alert'})