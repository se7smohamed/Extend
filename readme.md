# Extend.js

## How it works

Each rule consists of two parts: `template` and `output`.
`Template` is what the transpiler is looking for, it describes what your rule looks like. let's take python's negative indeces for example:

`{array} [{index}]`


Here we have declared two variables `array` and `index`, using the synyax `{variableName}`. to put these variables into action you will need the second part of the rule, the `output`.

```javascript
function ({array, index}) {
    if(n1>=0 || isNaN(n1)){
        return `${array}[${n1}]`
    }
    return `${array}[${array}.length${n1}]`
}
```


The `output` is a normal javascript function that recieves an object containing all variables that the transpiler found, it can be a good idea to use destructuring here.

The return of this function is what the compiler is going write to your code. if for any reason you think that something went wrong and you don't want to process this code, ie: one variable is undefined or it's conflicting with a different rule, just `return false`.

One last thing you need to know is the escape character which is the `#` sign.

Feel free to try it on http://extend.netlify.com/