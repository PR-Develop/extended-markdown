const {
  readdirSync,
  statSync,
  readFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} = require("fs");
const { join, sep } = require("path");

function getFilesFromDirectoryRecursive(staticpath, relativepath) {
  const fileNames = readdirSync(staticpath);
  let files = [];
  fileNames.forEach((file) => {
    if (statSync(join(staticpath, file)).isDirectory()) {
      files = [
        ...files,
        ...getFilesFromDirectoryRecursive(
          join(staticpath, file),
          join(relativepath, file)
        ),
      ];
    } else if (statSync(join(staticpath, file)).isFile()) {
      files.push({
        relative: join(relativepath, file),
        static: join(staticpath, file),
        data: readFileSync(join(staticpath, file), "utf-8"),
      });
    }
  });
  return files;
}

let files = getFilesFromDirectoryRecursive(join(__dirname, "./templates"), "");

files.forEach((file) => {
  const folders = file.relative.split(sep).slice(0, -1);
  if (folders.length === 0) return;
  let path = join(__dirname + "/output");
  folders.forEach((filePath) => {
    path = join(path, filePath);
    if (!existsSync(path)) {
      console.log(path);
      mkdirSync(path);
    }
    return path;
  });
});

let outputFiles = []

files.forEach((file) => {
  const includes = [
    ...file.data.matchAll(/<include>[a-zA-Z0-9]+.emd<\/include>/g),
  ];
  includes.forEach((include) => {
    const path = include[0].replace(/<include>/, "").replace(/<\/include>/, "")
    const includedata = readFileSync(join(__dirname ,"/components", path), "utf-8");
    file.data = file.data.replace("<include>" + path + "</include>", includedata)
  });
  outputFiles.push(file)
});

files.forEach((file) => {
  writeFileSync(
    join(__dirname, "/output", file.relative.replace(".emd", ".md")),
    file.data
  );
});
