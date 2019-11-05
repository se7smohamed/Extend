class D2Vector{
    constructor(x, y){ this.x = x; this.y = y; }
    _add_(vector){ return new D2Vector( this.x + vector.x, this.y + vector.y ) }
}

var v1 = new D2Vector( 2, 1 );var v2 = new D2Vector( 3, 7 );var v3 = new D2Vector( 30, 10 );
var v4 = (v1._add_(v2))._div_(v3)

array[array.length -3]
xxx = function(args) {
    var defaults = {"a1":null,"a2":null}
    var keys = ["a1","a2"]
    Object.assign( defaults, args )
    for( var i=0; i<keys.length; i++ ) {
        var prop = keys[i]
        this[prop] = defaults[prop] || defaults[i]
    }
    sss
}

xxx({0:1,a2:3})
