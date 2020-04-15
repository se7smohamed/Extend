var commandLineArgs = require("command-line-args");
var fs = require("fs");
var fse = require("fs-extra");
var path = require("path");
var chokidar = require("chokidar");
var compileModule = require("./compile");
var example = require("./example");

let badDirectories = ['git', 'node_modules']
var watcher = chokidar.watch("file or dir", {
  ignored: /node\_modules|\.git/,
  persistent: true
});
var folders = ["src", "dist"];
var extentions = [["xt"], ["xt", "js"]];
var defaultRulesFileName = "_extend.js";
var rulesFileName = "_extend.js";
var currentDirectory = process.cwd()
var srcDirectory = path.join(currentDirectory, folders[0]);
var distDirectory = path.join(currentDirectory, folders[0]);
var rulesfullName = path.join(currentDirectory, folders[0], rulesFileName);

var optionDefinitions = [
  { name: "help", alias: "h", type: Boolean },
  { name: "start", alias: "s", type: Boolean },
  { name: "other", defaultOption: true, type: String }
];

var defualtSettings = {
  srcFolder: 'src',
  distFolder: 'dist',
  codeOpening: '{{',
  codeClosing: '}}',
  variableOpening: '}',
  variableClosing: '}',
  arrayOpening: '[',
  arrayClosing: ']',
  escapeCharacter: '#',
}
var settings = defualtSettings

var userSettings = defualtSettings
try {
  var cliOptions = commandLineArgs(optionDefinitions);
} catch (error) {
  console.log("Unknown argument", error.optionName);
  console.log("Use -h for to show instructions.");
  process.exit();
}

if (cliOptions.help) {
  console.log(
    `use --example or -e to create a basic example, \nPlease refer to https://github.com/se7smohamed/Extend for further help.`
  );
  process.exit();
} else if (cliOptions.example) {
  console.log("Creating a Hello World example.");
  example.text.forEach(file => {
    fse.outputFileSync(file.file, file.text);
  });
}

getSettingsFile = fileName => {
  try {
    Object.keys(require.cache).forEach(function (key) { delete require.cache[key] })
    userRules = require(path.join(fileName));
    return userRules;
  } catch (MODULE_NOT_FOUND) {
    console.log("extend.js not found", fileName);
    return [];
  }
}
var getUserRules = (fileName) => {
  var userRules = getSettingsFile(fileName)
  var rules = userRules.rules;
  rules = compileModule.handleRules(rules);
  return rules;
};

var writeToFile = (processed, fileName) => {
  fse.outputFileSync(fileName, processed);
};

var localCompile = fileName => {
  // console.log('yo file', fileName);
  let badFileReg = new RegExp(`${badDirectories.join('|')}`)
  if (fileName.match(badFileReg)) {
    return console.log('xxxxxx bad dir')
  }
  var shoudCompile = name => {
    var nameList = name.split(".");
    if (path.basename(name) === rulesFileName) { return 'rules'; }
    if (nameList.slice(-1).join() === extentions[0].join()) return "xt";
    if (nameList.slice(-2).join() === extentions[1].join()) return "xt.js";
    return false;
  };

  var getPathAfterSrc = fileName => {
    var rmvPath = path.join(process.cwd(), folders[0]);
    var relativePath = fileName.replace(rmvPath, "");
    var outPath = path.join(folders[1], relativePath);
    return outPath;
  };
  var writeName = getPathAfterSrc(fileName);
  var shouldCompile = shoudCompile(fileName);
  if (shouldCompile === 'rules') {
    userRules = getUserRules(rulesfullName);
    console.log('updated user rules.')
    watcher.unwatch(fileName);
    watcher.add(fileName);
    return 1;
  }
  if (!shouldCompile){
    // console.log('==============================\n', writeName);
    return writeToFile(fs.readFileSync(fileName).toString(), writeName);
  }
  try {
    var sourceCode = fs.readFileSync(fileName).toString();
  } catch (e) {
    console.log(
      `An error has occured, please make sure file ${fileName} exists.`
    );
    return 1;
  }

  // console.log('tttttttt', userRules);
  var value = compileModule.processCode(sourceCode, [settings.codeOpening, settings.codeClosing], userRules);
  if (shouldCompile === "xt.js") writeName = writeName.replace(".xt", "");
  writeName = writeName.replace(path.extname(writeName), ".js");
  writeToFile(value, writeName);
  console.log('Success.')
};

function unlink(fileName) {
  fs.unlink(fileName, error => {
    console.log("unlink error", error);
  });
}

watcher
  .on("add", localCompile)
  .on("change", localCompile)
  .on("error", function (error) {
    console.log("An error has occured error...\n", e);
  });


const startWatching = () => {
  console.log("Started..");
  rulesFileName = "_extend.js";
  
  var extentions = [["xt"], ["xt", "js"]];
  var currentDirectory = process.cwd()
  rulesfullName = path.join(currentDirectory, rulesFileName);
  srcDirectory = path.join(currentDirectory, folders[0]);
  distDirectory = path.join(currentDirectory, folders[1]);
  userRules = getUserRules(rulesfullName);

  settingsFile = getSettingsFile(rulesfullName)
  settings = {...defualtSettings, ...settingsFile.settings}
  watcher.add(srcDirectory)
  watcher.add(path.join(process.cwd(), rulesFileName))
}



let strategy = 0

if (strategy === 1) {
  console.log("Started...");
  var userRules = getUserRules(rulesfullName);
  watcher.add(srcDirectory);
} else {
  startWatching()
}


// setTimeout(() => {
//   process.exit()
// }, 100)