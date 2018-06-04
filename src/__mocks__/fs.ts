import { Stats } from "fs";

const dirStats = {
  isFile: () => false,
  isDirectory: () => true
};

const fileStats = {
  isFile: () => true,
  isDirectory: () => false
};

const paths = {
  ok: ["package.json", "src"],
  "ok/src": ["index.ts", "index.test.ts"],
  err: ["package.json"]
};

const stats = {
  ok: dirStats,
  "ok/package.json": fileStats,
  "ok/src": dirStats,
  "ok/src/index.ts": fileStats,
  "ok/src/index.test.ts": fileStats,
  err: dirStats
};

export function readdir(
  path: string,
  callback: (error?: Error, files?: string[]) => void
) {
  if (paths[path]) {
    callback(undefined, paths[path]);
  } else {
    callback(new Error(`readdir(): Path "${path}" not found in mock "fs".`));
  }
}

export function stat(
  path: string,
  callback: (error?: Error, stats?: Stats) => void
) {
  if (stats[path]) {
    callback(undefined, stats[path]);
  } else {
    callback(new Error(`stat(): Path "${path}" not found in mock "fs".`));
  }
}
