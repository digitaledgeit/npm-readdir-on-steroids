import readdir, { Stats } from "../src";

const directory = process.argv[3] || ".";

// only list files
function listFilter(path: string, stats: Stats) {
  return stats.isFile();
}

// don't traverse the .git, lib, node_modules or .vscode directories
function walkFilter(path: string, stats: Stats) {
  return (
    !/\.git$/.test(path) &&
    !/lib/.test(path) &&
    !/node_modules/.test(path) &&
    !/\.vscode/.test(path)
  );
}

readdir(directory, { listFilter, walkFilter }).then(
  paths => console.log(paths.join("\n")),
  error => console.error(error)
);
