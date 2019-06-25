let employees = [
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
]

let add$ = number => number + '$'
let salaries = _{[ add$(a.salary) for a in employees]}

_{for(1...10) {
    console.log("Boo!") 
}}

console.log(salaries)