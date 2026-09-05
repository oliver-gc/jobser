import { createClient } from "redis";

export type Job = {
  taskName: string;
  args: unknown[];
};

export class Jobser {
  private jobserQueues: string[];
  private client;

  private constructor(jobserQueues: string[]) {
    this.client = createClient({
      url: "redis://127.0.0.1:6379",
    });

    this.client.on("error", (err) => console.log("Redis Client Error", err));
    this.jobserQueues = jobserQueues;
  }

  static async create(jobserQueues: string[]): Promise<Jobser> {
    const queue = new Jobser(jobserQueues);
    await queue.client.connect();
    return queue;
  }

  async queueTask(queueName: string, taskName: string, args: unknown[]): Promise<void> {
    if (!this.jobserQueues.includes(queueName)) {
      throw new Error(`Unknown queue: ${queueName}`);
    }

    const job: Job = { taskName, args };
    await this.client.lPush(queueName, JSON.stringify(job));
  }

  async waitForJob(queueName: string): Promise<Job> {
    if (!this.jobserQueues.includes(queueName)) {
      throw new Error(`Unknown queue: ${queueName}`);
    }

    const result = await this.client.brPop(queueName, 0);

    if (!result) {
      throw new Error("Redis stopped waiting for a job");
    }

    return JSON.parse(result.element) as Job;
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
