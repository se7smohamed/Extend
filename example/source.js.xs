class D2Vector{ constructor(x, y){ this.x = x; this.y = y; }
    _add_(vector){ return new D2Vector( this.x + vector.x, this.y + vector.y ) }
}

var v1 = new D2Vector( 2, 1 );var v2 = new D2Vector( 3, 7 );var v3 = new D2Vector( 30, 10 );
var v4 = {{ v1 + v2 + v3 }}
console.log(v4)

var myFunction = {{ func xyz( x=1, y=2, z=3 ){
    return [x, y, z]
}}}

{{ myFunction(1, b=2) }}