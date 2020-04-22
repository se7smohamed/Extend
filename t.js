f2 = function() {
  console.log(x)
}

function f1() {
  var x = 2
  console.log(this.x)
  // f2.call(this)
}


var x = 3
f1()
