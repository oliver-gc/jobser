import "../tasks/test.js";
import { pathToFileURL } from "node:url";

import { Jobser } from "../queue/queue.js";
import { execute } from "./worker.js";

export async function start(): Promise<never> {
  const queue = await Jobser.create(['topxq']);
  const keepAlive = setInterval(() => {}, 2 ** 31 - 1);

  try {
    while (true) {
      const job = await queue.waitForJob('topxq');

      try {
        await execute(job.taskName, job.args);
      } catch (error) {
        console.error(`Task ${job.taskName} failed`, error);
      }
    }
  } finally {
    clearInterval(keepAlive);
    await queue.close();
  }
}

const isDirectRun =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  start().catch((error: unknown) => {
    console.error("Worker failed", error);
    process.exitCode = 1;
  });
}