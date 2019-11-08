class D2Vector{
    constructor(x, y){ this.x = x; this.y = y; }
    _add_(vector){ return new D2Vector( this.x + vector.x, this.y + vector.y ) }
}

var v1 = new D2Vector( 2, 1 );var v2 = new D2Vector( 3, 7 );var v3 = new D2Vector( 30, 10 );
var v4 = (v1._add_(v2))._div_(v3)

array[array.length -3]
var myFunction = function(args) {
    var defaults = {"x":"1","y":"2","z":"3"}
    var keys = Object.keys(defaults)
	for(prop in args){
		if(isNaN(prop)){ defaults[prop] = args[prop]}
		else{defaults[keys[prop]] = args[prop]}
    }
    for( var i=0; i<keys.length; i++ ) {
        this[keys[i]] = defaults[keys[i]]
    }

    return [x, y, z, defaults, args]
}

myFunction({0:99, b:2})