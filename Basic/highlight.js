const fs = require('fs');
const decomment = require('decomment');
const compile = require('./compile');



var readSettings = () => {
    var settings
    try{
        try{ 
            var file = fs.readFileSync('./.vscode/settings.json', 'utf8')
            var text = decomment(file).trim()||"{}"
        }
        catch(ENOENT){ text = "{}" }
        settings = JSON.parse(text);
    }catch(e){
        console.log('invalid settings.json.')
        return false
    }
    return settings
}

var writeSettings = settings => {
    text = JSON.stringify(settings, '', 2)
    try{ fs.mkdirSync('./.vscode') }
    catch(EEXIST){}
    fs.writeFileSync('./.vscode/settings.json', text)
}


var escapeRegex = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


// wordType = word => word.type === 'word' ? 'static' : 'dynamic'

var createRegex = (words, terminals=['`{{', '}}`']) => {
    let text = ''
    terminals = [escapeRegex(terminals[0]), escapeRegex(terminals[1])]

    let groups = []
    let r = ''
    let group = string => r+'(' + string + ')'+r
    let anyButWord = word => `(?!(${ word }).*)`

    text += group(( terminals[0]))
    //569CD6',
    let colors = {
        word: {color: '#C586C0' },
        var: {color: '#9CDCFE'  },
        arrayVar: {color: '#a22' },
        terminals: {color: '#ccc8' },
        symbol: {color: '#ddd' },
        default: {color: '#c44' },
    }

    groups.push( {color: colors['terminals']} )
    
    nextStaticString = words => {
        words.push({type: 'word', value: group(escapeRegex(terminals[1]))})
        return words.reduce((prev, curr) => {
            if(curr.type !== 'word') return prev
            return `${prev?prev+'|':''}${curr.value}`
        }, '')
    }
    

    words.forEach( (word, i) => {
        if ( word.type==='word' || word.type === 'symbol') {
            // console.log(escapeRegex(word.value))
            text += group('[\\s]*'+ escapeRegex(word.value) +'[\\s]*')
            groups.push({color: colors[word.type] || colors['default']})
        }else{
            text += `([\\s\\S][^${ (terminals[1]) }]*)`
            groups.push({color: colors[word.type] || colors['default']})
        }
        `{{ s z aasdasd}}`
    })
    
    text += group((terminals[1]) )
    groups.push( {color: colors['terminals']} )

    return { [text]: groups}
}


var lastSettings = ''
var start = (userRules, terminals) => {
    var settings = readSettings()
    if(!settings) return false

    let rules = userRules
    settings['highlight.regexes'] = {}
    
    rules.forEach(rule => {
        let block = createRegex(rule.parsed, terminals)
        settings['highlight.regexes'] = {...settings['highlight.regexes'], ...block }
    })
    
    settings['highlight.regexes'][`(${terminals[0]})([\\s\\S][^${terminals[1]}]*)(${terminals[1]})`] = [
        {color: '#ccc4'},
        {color: '#ddd'},
        {color: '#ccc4'},
    ]

    a = `{{asdads}}`
    
    settingsStr = JSON.stringify(settings)
    if(settingsStr !== lastSettings) writeSettings(settings)
    lastSettings = settingsStr 
}


exports.start = start