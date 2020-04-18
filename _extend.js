module.exports.settings = {
  srcFolder: 'src',
  distFolder: 'dist',
  codeOpening: '/**',
  codeClosing: '**/',
  variableOpening: '{',
  variableClosing: '}',
  arrayOpening: '[',
  arrayClosing: ']',
  escapeCharacter: '#',
}

const process = (filter, variable) => {
  if(filter instanceof RegExp)
    return variable.match(fitler)
  else if (filter instanceof Function)
    return filter(variable)
}


const and = (...filters) => 
  variable => filters.every( filter => process(filter, variable) )

const or = (...filters) => 
  variable => filters.some( filter => process(filter, variable) )


const startsWithA = variable => variable[0].toLowerCase() === 'a'
const startsWithB = variable => variable[0].toLowerCase() === 'b'
const experimental = (variable, vars, name) => {
  vars.xxx = 'xxx'
  return variable.slice(0, -3)
}
module.exports.types = {
  int: /^\d+$/,
  float: /^\d+\.\d+$/,
  // matches any thing (useless)
  any: v => true,
  // matches nothing (useless)
  none: v => false,
  // turns all variables into AAAAA (also useless)
  AAAAA: v => 'AAAAA',
  // 'and' + 'or' functions are both included in the starting project
  startsWithAorB: or(startsWithA, startsWithB)
}

module.exports.rules = [
  {
    id: 'if cnd',
    template: 'if {cnd}#{{code}#}',
    output: ({ cnd, code }) => `if (${cnd}) {
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
    template: '{array} #[{start}:{end}#]',
    output: ({ array, start, end }) => {
      return `${array}.slice(${start}, ${end})`
    }
  },
  {
    id: 'arrayComprehension',
    template: '#[ {el} for {elName} in {array} #]',
    output: function ({ array, el, elName }) {
      return `${array}.map( ${elName}=> ${el})`
    }
  },
  {
    id: 'for',
    template: 'for {i}:{max}#{{code}#}',
    output: ({i,max,code}) => `for(let ${i}=0; ${i}<${max}; ${i}++){
      ${code}
    }`
  },
  {
    template: `<{elementName} {attributesArray}["{attr}"="{value}"] />`,
    output: b => 'eldata='+JSON.stringify(b)
  }
]