import readdir, { Stats } from "../src";

const directory = process.argv[4] || ".";

const times: number[] = [];

function printStats() {
  // clear the terminal
  console.clear();

  // calculate the stats
  let worst = 0;
  let best = Infinity;
  const avg =
    Math.round(
      (times.reduce((total, time) => {
        if (time > worst) {
          worst = time;
        }
        if (time < best) {
          best = time;
        }
        return total + time;
      }, 0) /
        times.length) *
        1000
    ) / 1000;

  // print the results
  console.log(`times=${times.length} avg=${avg} best=${best} worst=${worst}`);
}

new Array(1000)
  .fill(0)
  .reduce(
    promise =>
      promise.then(async () => {
        const start = Date.now();
        await readdir(directory);
        times.push(Date.now() - start);
        printStats();
      }),
    Promise.resolve()
  )
  .then(() => printStats(), (error: Error) => console.error(error));

/*

  Results:

    - With promises #1: times=1000 avg=429.256 best=391 worst=628
    - With promises #2: times=1000 avg=448.46 best=399 worst=625
    - With promises #3: times=1000 avg=446.045 best=394 worst=636

    - With callbacks #1: times=1000 avg=281.649 best=262 worst=433
    - With callbacks #2: times=1000 avg=278.574 best=261 worst=457
    - With callbacks #3: times=1000 avg=278.646 best=260 worst=432
    
    - With callbacks and emitter #1: times=1000 avg=291.461 best=270 worst=372
    - With callbacks and emitter #2: times=1000 avg=295.178 best=267 worst=500

    - With callbacks and emitter and filter check #1: times=1000 avg=287.289 best=262 worst=512
    - With callbacks and emitter and filter check #2: times=1000 avg=289.547 best=262 worst=971

*/
