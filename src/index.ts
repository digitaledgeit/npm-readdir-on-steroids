import * as FS from "fs";
import * as Path from "path";
import { promisify } from "util";
import { EventEmitter } from "events";

const getPaths = promisify(FS.readdir);
const getStats = promisify(FS.stat);

export interface Stats extends FS.Stats {
  root: string;
  depth: number;
}

export interface Options {
  concurrency?: number;
  listFilter?: (path: string, stats: Stats) => boolean; // filters the files and folders that will be listed.
  walkFilter?: (path: string, stats: Stats) => boolean; // filters the folders that will be walked/read.
}

export default function(
  root: string,
  options: Options = {}
): PromiseLike<string[]> {
  const {
    concurrency = 4,
    listFilter = () => true,
    walkFilter = () => true
  } = options;

  return new Promise((resolve, reject) => {
    let countOfActiveWorkers = 0;
    let countOfFinishedWorkers = 0;
    const listOfPaths: string[] = [];
    const directoriesToRead: [string, number][] = [[root, 0]];

    const worker = async () => {
      // get the next directory and depth
      const directoryToRead = directoriesToRead.pop();

      // check if we're finished looking at directories
      if (!directoryToRead) {
        if (countOfActiveWorkers === 0) {
          ++countOfFinishedWorkers;
          if (countOfFinishedWorkers === concurrency) {
            resolve(listOfPaths.sort());
          }
        } else {
          setImmediate(worker);
        }
        return;
      }

      const [directory, depth] = directoryToRead;

      // read the directory and filter the paths
      ++countOfActiveWorkers;
      try {
        const paths = await getPaths(directory);
        await Promise.all(
          paths.map(async path => {
            const fullPath = Path.join(directory, path);
            const stats = (await getStats(fullPath)) as Stats;

            stats.root = root;
            stats.depth = depth;

            if (listFilter(fullPath, stats)) {
              listOfPaths.push(Path.relative(root, fullPath));
            }

            if (stats.isDirectory()) {
              if (walkFilter(fullPath, stats)) {
                directoriesToRead.push([fullPath, depth + 1]);
              }
            }
          })
        );
      } catch (error) {
        reject(error);
      }
      --countOfActiveWorkers;

      // do it all again
      await worker();
    };

    // start multiple workers
    worker();
    for (let i = 1; i < concurrency; ++i) {
      setImmediate(worker, 0);
    }
  });
}
