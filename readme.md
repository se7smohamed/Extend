# Extend

Extend is the tool to bring your ideas into the javascript world, unlike existing js compilers extend is not meant to bring a specific set of features to javascript, it's here for you to create your own.

## Installation
To get started you need to install Extend using 
```
npm install -g extendx
```
Please note we are going to use the name extend<u>x</u> for the cli for now.


## Usage

To create your first project use the command 

```
extendx --start
```
which is going to create a basic project for you to start with.

The first thing that you are going to need is the `_extend.js` file in your root directory,
this is where your *rules* live and is just a normal javascript with a few exports, one of which is `rules`, more about that in a second.

The compiler will then look for code inside your `src` folder, only files with extensions `.xt` or `.xt.js` will be processed.
in this stage of development, the compiler will require a character or more to indicate blocks of code that will require compiling.

in this example we used the mustache syntax, but you can choose any other syntax, one trick is to use multiline comment syntax in your programming language to avoid your code being highlighted as an error by your IDE.

eg:&nbsp; `var salaries = {{ [employee.salary for employee in employees] }}`

Once done, the compiler will write the processed version of your code to `dist` folder.



## Working with rules

Each rule is a js `Object` consisting of two parts: `template` and `output`.
`template` is what the compiler is going to looking for, it describes what your rule looks like. let's take python slicing for example:

`{array} #[{start}:{end}#]`


Here we have declared three variables `array`, `start` and `end`, using the syntax `{variableName}`, as you can see we have escaped the squared brackets, otherwise, the compiler would treat variable differently, specifically as an array, but let's not worry about that now.

To start using these variables, you will need the second part of the rule, the `output`.

```javascript
function ({ array, start, end }) {
  return `${array}.slice(${start}, ${end})`
}
```


The `output` is a normal javascript function that recieves an object containing all variables that the compiler found, it can be a good idea to use destructuring here.

The return of this function is what the compiler is going write to your code. if for any reason you think that something went wrong and you don't want to process this code, eg: variable is undefined, or it's conflicting with a different rule, you need to return `false`.

One last thing you need to know is the escape character which is the `#` sign, which you have already seen.



Feel free to try it live on http://extend.netlify.com/ (might be out of date).
<br/>
<br/>


#### Arrays
An array is a special type of variable that matches a repetitive syntax which is then as an... *ahem* array

here is an example for a rule that extracts html attributes using one.
```javascript
rule.template = '<{elementName} {attributesArray}["{attrName}"="{value}"] />'
```


## `_exend.js` file
`_exend.js` is a file that lives in your projects root directory and has 3 exports: `rules`, `settings` for the `compiler`, as well as `types`.


### Settings
The default settings are as follows, note that `codeOpening` and `codeClosing` are for your source code files and are used to highlight code that needs to be processed, you can use whatever you want, or you can use the comment syntax in your programming language as mentioned above.

`variableOpening`, `variableClosing`, `arrayOpening`, and `arrayClosing` all apply to your templates, inside your `_extend.js` file.

```javascript
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
```

### Types
Types is a object that serves as a way for you to control what each of your variables should like. each type will have a name which is going to be used inside your `_extend.js` file, the value can either be a Regex or a js function which receives the variable, and returns `true` if the variable fits the requirements.

\[experimental\]: You can return a string from the type function which is going to replace the existing variable. you also receive both the variables block, containing all found variables in this rule, as well as current variable name as the second and third argument, feel free to play around with those.

```javascript
var startsWithA = variable => variable[0].toLowerCase() === 'a'
var startsWithB = variable => variable[0].toLowerCase() === 'b'
module.exports.types = {
  int: /^\d+$/,
  float: /^\d+\.\d+$/,
  // matches any thing (useless)
  any: v => true,
  // matches nothing (useless)
  none: v => false,
  // turn any variable into AAAAA (also useless)
  AAAAA: v => 'AAAAA',
  // 'and' + 'or' functions are both included in the starting project
  startsWithAorB: or(startsWithA, startsWithB)
}
```

to use the type you declare your variables as: `{startsWithAorB MyVariable}`, which will only accept variables that match this filter.


## What's new

### 0.2
Added variable types using regex or js functions.

### 0.1.0
Added array support.

Added rules settings.