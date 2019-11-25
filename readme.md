# Extend

Extend is the tool to bring your ideas into the javascript world. 

## Installation
To get started you need to install Extend using 
```
npm install -g extendx
```
Please note we are going to use the name extend*x* for the cli for now.


## Usage

To create your first project using Extend please run the command 

```
extendx --example
```
which is going to create a very basic project to start with.

The first thing that you are going to need is the `_rules.js` file inside your `src` folder,
this is where your *rules* live and is just a normal javascript with one array exported that is `rules`, more about that in a second.

The compiler will then look for code inside your `src` folder, only files with extension `.xt` will be processed.
since this is a very early stage, we are going to use the mustache syntax to highlight the parts that will require comiling.

eg: &nbsp; `var element = {{ My  <-- New @ AmAzIng --> Syntax }}`

Once done, the compiler will write the processed version of your code to `dist` folder.



## Working with rules

Each rule is an `Object` consisting of two parts: `template` and `output`.
`template` is what the compiler is going to looking for, it describes what your rule looks like. let's take python's negative indeces for example:

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


The `output` is a normal javascript function that recieves an object containing all variables that the compiler found, it can be a good idea to use destructuring here.

The return of this function is what the compiler is going write to your code. if for any reason you think that something went wrong and you don't want to process this code, ie: variable is undefined, or it's conflicting with a different rule, just return `false`.

One last thing you need to know is the escape character which is the `#` sign.

Feel free to try it live on http://extend.netlify.com/