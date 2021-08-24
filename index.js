const { readdirSync, statSync, readFileSync } = require("fs");
const { join } = require("path");

function getFilesFromFolder(staticpath) {
  let results = readdirSync(staticpath);
  let folders = [];
  let files = [];
  results.forEach((result) => {
    result = join(staticpath, result);
    if (statSync(result).isDirectory()) {
      folders.push(result);
      const folderfiles = getFilesFromFolder(result);
      folderfiles.forEach((folderfile) => files.push(folderfile));
    } else if (statSync(result).isFile()) {
      files.push(result);
    }
  });
  return files;
}

let templatePaths = getFilesFromFolder(join(__dirname, "./templates"));
let componentPaths = getFilesFromFolder(join(__dirname, "./components"));
let templates = templatePaths.map((path) => {
  return { path: path, data: readFileSync(path, "utf-8") };
});

console.log("Templates:", templates);
// console.log("Templates:", components);
