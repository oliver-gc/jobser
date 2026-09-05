import { Jobser, type Job } from "./src/queue/queue.js";

const newQueue = await Jobser.create(['topxq']);

try {
  await newQueue.queueTask('topxq', 'send_welcome_email', ['2']);
  await newQueue.queueTask('topxq', 'send_welcome_email', ['3']);
  await newQueue.queueTask('topxq', 'send_welcome_email', ['4']);
  await newQueue.queueTask('topxq', 'send_welcome_email', ['5']);
  console.log(`Queued 'send_welcome_email'`);
} finally {
  await newQueue.close();
}