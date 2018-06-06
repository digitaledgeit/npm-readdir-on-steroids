import { readdir, stat, Stats as FileSystemStats } from "fs";
import { join, relative } from "path";
import { EventEmitter } from "events";
import { Queue, Next } from "./queue";

/*
  Using native callback versions of the API is about 35% more efficient than using promisfied versions
*/

export interface Stats extends FileSystemStats {
  root: string;
  depth: number;
}

export interface Options {
  concurrency?: number;
  listFilter?: (path: string, stats: Stats) => boolean; // filters the files and folders that will be listed.
  walkFilter?: (path: string, stats: Stats) => boolean; // filters the folders that will be walked/read.
}

export interface ReaddirPromise<T> extends Promise<T> {
  on(event: "read", listener: (path: string, stats: Stats) => void): void;
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: "read", listener: (path: string, stats: Stats) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
}

export default function(
  root: string,
  options: Options = {}
): ReaddirPromise<string[]> {
  const { concurrency = 4, listFilter, walkFilter } = options;
  const list: string[] = [];
  const queue = new Queue();
  const emitter = new EventEmitter();
  const promise: Partial<ReaddirPromise<string[]>> = new Promise<string[]>(
    (resolve, reject) => {
      const createStatTask = (path: string, depth: number) => (next: Next) => {
        stat(path, (error, stats) => {
          if (error) {
            next(error);
            return;
          }

          // cast to readdir stats because spreading loses the methods
          const readdirStats: Stats = stats as Stats;
          readdirStats.root = root;
          readdirStats.depth = depth;

          const relativePath = relative(root, path);

          if (
            !listFilter ||
            (listFilter && listFilter(relativePath, readdirStats))
          ) {
            list.push(relativePath);
            emitter.emit("read", relativePath, readdirStats);
          }

          if (stats.isDirectory()) {
            if (
              !walkFilter ||
              (walkFilter && walkFilter(relativePath, readdirStats))
            ) {
              queue.enqueue(createReaddirTask(path, depth + 1));
            }
          }

          next();
        });
      };

      const createReaddirTask = (directory: string, depth: number) => (
        next: Next
      ) => {
        readdir(directory, (error, paths) => {
          if (error) {
            next(error);
            return;
          }
          paths.forEach(path =>
            queue.enqueue(createStatTask(join(directory, path), depth))
          );
          next();
        });
      };

      queue.enqueue(createReaddirTask(root, 0));

      // give consumers a chance to register listeners
      setImmediate(() => {
        queue.run(error => {
          if (error) {
            reject(error);
          } else {
            resolve(list);
          }
        });
      });
    }
  );

  promise.on = emitter.on.bind(emitter);
  promise.off = emitter.removeListener.bind(emitter);

  return promise as ReaddirPromise<string[]>;
}
