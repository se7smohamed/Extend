let word = `
a = _{[   a.x.y.zzz for a in list ]}
a = _{[a.x.y.zzz for a in list]}
`
word = word.trim()
word = word.split(/\s+^\r\n^\n]/)

// console.log(word)
console.log(word.join(''))