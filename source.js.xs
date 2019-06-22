let employees = [
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
    {name: 'Foo', age: 32, salary: 200000},
]

// let add$ = number => number + '$'
let salaries = _{[a.salary for a in employees]}

console.log(salaries)