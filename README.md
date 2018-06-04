# readdir-on-steroids

Recursively read the contents of a directory.

## Installation

```bash
npm install readdir-on-steroids
```

## Usage

```js
import readdir from "readdir-on-steroids";

const directory = process.argv[3] || ".";

// only list files
function listFilter(path, stats) {
  return stats.isFile();
}

// don't traverse the .git, lib, node_modules or .vscode directories
function walkFilter(path, stats) {
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
```

Output:

```
.gitignore
README.md
examples/index.ts
package.json
src/__mocks__/fs.ts
src/index.test.ts
src/index.ts
yarn.lock
```

## API

```ts
readdir(directory: string, options?: Options): Promise<string[]>
```

| Parameter   | Type      | Required | Default | Description            |
| ----------- | --------- | -------- | ------- | ---------------------- |
| `directory` | `string`  | ✓        |         | The directory to read. |
| `options`   | `Options` |          | `{}`    | The options.           |

### Options

| Parameter     | Type                                      | Required | Default | Description                                           |
| ------------- | ----------------------------------------- | -------- | ------- | ----------------------------------------------------- |
| `concurrency` | `number`                                  |          | 4       | The maximum number of concurrent calls to `readdir`.  |
| `listFilter`  | `(path: string, stats: Stats) => boolean` |          |         | A function filtering the paths that will be returned. |
| `walkFilter`  | `(path: string, stats: Stats) => boolean` |          |         | A function filtering the paths that will be walked.   |

### Stats

| Parameter | Type     | Required | Default | Description                                   |
| --------- | -------- | -------- | ------- | --------------------------------------------- |
| `root`    | `string` | ✓        |         | The root directory being read.                |
| `depth`   | `number` | ✓        |         | The relative depth from the `root` directory. |
