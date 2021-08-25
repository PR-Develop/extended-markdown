#! /usr/bin/env node

let { access } = require("fs");
let args = process.argv.slice(2);
let readline = undefined;
let rl = undefined;
commandlist = [];

addToCommadList("-help", () => {
  console.log("\nAvailable commands: ");
  commandlist.forEach((element) => {
    if (element.name !== "default") {
      console.log(element.name);
    }
  });
});

addToCommadList("-input", (i) => {
  console.log("inputpath: " + args[i + 1]);
});

addToCommadList("-output", (i) => {
  console.log("outputpath: " + args[i + 1]);
});

addToCommadList("default", (i) => {
  access(args[i], function (error) {
    if (error) {
      console.log("Command Not found");
    } else {
      console.log("Directory exists.");
    }
  });
});

function addToCommadList(command, callback) {
  commandlist.push({ name: command, run: callback });
}

function runCommands(commandName, index) {
  let hasRun = false;
  for (let i = 0; i < commandlist.length; i++) {
    if (commandlist[i].name === commandName) {
      hasRun = true;
      commandlist[i].run(index);
    }
    if (i == commandlist.length - 1 && !hasRun) {
      let c = commandlist.findIndex((x) => x.name === "default");
      commandlist[c].run(index);
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
  cli();
} else {
  args.forEach((element, i) => {
    runCommands(element, i);
  });
}

function cli() {
  readline = require("readline");
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on("line", function (line) {
    args = stringToArgs(line);
    args.forEach((element, i) => {
      runCommands(element, i);
    });
  });
}
