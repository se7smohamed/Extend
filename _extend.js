
// {{ array[ -2 ] }}

// {{ array [0:23] }}

// {{ array[ 2 ] }}


// let employees = [
//     {name: x, salary: 1000},
//     {name: x, salary: 1000},
//     {name: x, salary: 1000},
//     {name: x, salary: 1000},
// ]

// let salaries = {{ [ employee.salary for employee in array] }}

module.exports.settings = {
  srcFolder: 'src',
  distFolder: 'dist',
  codeOpening: '/**',
  codeClosing: '**/',
  variableOpening: '}',
  variableClosing: '}',
  arrayOpening: '[',
  arrayClosing: ']',
  escapeCharacter: '#',
}

module.exports.rules = [
  {
    id: 'if cnd',
    template: 'if {cnd}#{{code}#}',
    output: ({ cnd, code }) => `
      (${cnd}){
        ${code}
      }`
  },
  {
    id: 'negative index',
    template: '{array} #[{i}#]',
    output: ({ array, i }) => {
      i = i.trim()
      if (i.includes(':')) return false
      if (i[0] === '-') return `${array}[${array}.length${i}]`
      return `${array}[${i}]`
    }
  },
  {
    id: 'py slice',
    template: '{array} #[{s}:{e}#]',
    output: ({ array, s, e }) => {
      if (!e) e = array + '.length-1'
      if (!s) s = 0
      return `${array}.slice(${s}, ${e})`
    }
  },
  {
    id: 'arrayComprehension',
    template: '#[ {el} for {elName} in {array} #]',
    output: function ({ array, el, elName }) {
      return `${array}.map( ${elName}=> ${el})`
    }
  },
]

























// module.exports.rules = [
//     {
//         id: 'test',
//         template: 'w1 {yoMyArray}[{var1}=({val1})] w2',
//         output: (o) => JSON.stringify(o) + '\n//rule1'

//     },
//     {
//         id: 'tesxt',
//         template: '<{element} {attrs}["{key}"="{value}"]>',
//         output: ({element, attrs}) => `${element}.attributes = ${JSON.stringify(attrs)}`
//     },

//     {
//         id: 'for',
//         template: 'for {i}:{max}#{{code}#}',
//         output: ({i,max,code}) => `
// for(let ${i}=0; ${i}<${max}; ${i}++){
//     ${code}
// }
// `
//     },
//     {
//         id: 'if cnd',
//         template: 'if {cnd}#{{code}#}',
//         output: ({cnd,code}) => `if(${cnd}){
//     ${code}
// }`
//     },

// ]




// a = {{
//   w1 [somevar1=(someval1) somevar2=(someval2)] w2
// }}


// {{
//   <div "color"="red" "id"="main" "key3"="val3">
// }}


// {{
//   for j:10{
//       alert(j)
//   }
// }}


// {{
//   if true {
//       console.log('.1+.2 !== .3')
//   }
// }}