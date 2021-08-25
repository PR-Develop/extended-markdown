#! /usr/bin/env node

let args = process.argv.slice(2);
let readline = undefined;
let rl = undefined;

commandlist = [];

addToCommadList("-help", () => {
  console.log("\nAvailable commands: ");
  commandlist.forEach((element) => {
    console.log(element.name);
  });
});

addToCommadList("-input", (i) => {
  console.log("inputpath: " + args[i + 1]);
});

addToCommadList("-output", (i) => {
  console.log("outputpath: " + args[i + 1]);
});

function addToCommadList(command, callback) {
  commandlist.push({ name: command, run: callback });
}

function runCommands(commandName, index) {
  for (let i = 0; i < commandlist.length; i++) {
    if (commandlist[i].name === commandName) {
      commandlist[i].run(index);
    }
  }
}

function stringToArgs(string) {
  let myargs = string.split(" ");
  return myargs;
}

function isInArgs(name, myargs) {
  let result = false;
  myargs.forEach((element) => {
    if (element === name) {
      result = true;
    }
  });
  return result;
}

console.log(args);

if (args.length <= 0) {
  readline = require("readline");
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
}

rl.on("line", function (line) {
  args = stringToArgs(line);
  args.forEach((element, i) => {
    runCommands(element, i);
  });
});
