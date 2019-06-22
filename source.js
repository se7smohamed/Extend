let employees = [
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
]

// let add$ = number => number + '$'
let salaries = employees.map( function(a){
    return (a.salary)
})


console.log(salaries)