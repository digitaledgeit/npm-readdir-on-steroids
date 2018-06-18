export type Next = (error?: Error) => void;
export type Task = (next: Next) => void;

export interface QueueOptions {
  concurrency?: number;
}

export class Queue {
  private readonly tasks: Task[] = [];

  constructor(private readonly options: QueueOptions = {}) {}

  enqueue(task: Task) {
    this.tasks.push(task);
    return this;
  }

  run(callback: (error?: Error) => void) {
    const { concurrency = 4 } = this.options;
    let countOfActiveWorkers = 0;
    let countOfFinishedWorkers = 0;
    let taskError: Error | undefined;

    const finishTask = (error?: Error) => {
      --countOfActiveWorkers;

      // store the error if there was one
      if (!taskError && error) {
        taskError = error;
      }

      startTask();
    };

    const startTask = () => {
      const task = this.tasks.pop();

      // check if there was an error
      if (taskError) {
        ++countOfFinishedWorkers;
        if (countOfFinishedWorkers === concurrency) {
          callback(taskError);
        }
        return;
      }

      // check if we've finished i.e. there are no more tasks to process and there are no active workers
      if (!task) {
        if (countOfActiveWorkers === 0) {
          ++countOfFinishedWorkers;
          if (countOfFinishedWorkers === concurrency) {
            if (taskError) {
              callback(taskError);
            } else {
              callback();
            }
          }
        } else {
          setImmediate(startTask);
        }
        return;
      }

      ++countOfActiveWorkers;
      task(finishTask);
    };

    // start multiple workers
    startTask();
    for (let i = 1; i < concurrency; ++i) {
      setImmediate(startTask);
    }

    return this;
  }
}
