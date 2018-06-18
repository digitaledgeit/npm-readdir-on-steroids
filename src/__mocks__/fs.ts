import { Stats } from "fs";

const dirStats = {
  isFile: () => false,
  isDirectory: () => true
} as Stats;

const fileStats = {
  isFile: () => true,
  isDirectory: () => false
} as Stats;

const paths: { [path: string]: string[] } = {
  ok: ["package.json", "src"],
  "ok/src": ["index.ts", "index.test.ts"],
  err: ["package.json", "src", "examples"],
  "err/src": ["index.ts", "index.test.ts"],
  "err/examples": ["foobar.ts"]
};

const stats: { [path: string]: Stats } = {
  ok: dirStats,
  "ok/package.json": fileStats,
  "ok/src": dirStats,
  "ok/src/index.ts": fileStats,
  "ok/src/index.test.ts": fileStats,
  err: dirStats,
  "err/package.json": fileStats,
  "err/src": dirStats,
  "err/examples": dirStats,
  "err/src/index.ts": fileStats,
  "err/src/index.test.ts": fileStats
};

export function readdir(
  path: string,
  callback: (error?: Error, files?: string[]) => void
) {
  setTimeout(() => {
    if (paths[path]) {
      callback(undefined, paths[path]);
    } else {
      callback(new Error(`readdir(): Path "${path}" not found in mock "fs".`));
    }
  }, Math.round(Math.random() * 100));
}

export function stat(
  path: string,
  callback: (error?: Error, stats?: Stats) => void
) {
  setTimeout(() => {
    if (stats[path]) {
      callback(undefined, stats[path]);
    } else {
      callback(new Error(`stat(): Path "${path}" not found in mock "fs".`));
    }
  }, Math.round(Math.random() * 100));
}
